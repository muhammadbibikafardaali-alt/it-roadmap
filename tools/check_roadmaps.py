#!/usr/bin/env python3
"""Content checker for the IT Roadmap data file (src/data/roadmaps.json).

It makes sure every roadmap shown on the site is complete and consistent:

* every track in "tracks" has a roadmap for each required level
  (beginner, intermediate, advanced) plus a capstone project and job titles
* there is one closing "goal" phase for every wizard goal (job, freelance,
  switch, skill); its topics may use the placeholders {capstone} and {roles}
* every phase has a title, a sensible number of weeks, 3-8 topics and
  at least one resource
* every resource has a name and an https:// URL, with no duplicate URL
  inside the same phase
* no resource points at a site we know is retired or has moved
* the total length of each roadmap is in a realistic range
* warnings: phases with a single resource, and arrows (← →) in topic text,
  which flip direction when Arabic and Latin words are mixed (bidi)

Optional: ``--links`` also opens every unique URL and reports the ones that
do not answer with a 2xx/3xx status (needs internet access).

Usage:
    python3 tools/check_roadmaps.py              # structure + content checks
    python3 tools/check_roadmaps.py --links      # + live link check
    python3 tools/check_roadmaps.py --summary    # print a short table per track

Exit code is 1 when there is at least one error (warnings do not fail).
Only the Python standard library is used.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import json
import re
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DATA = ROOT / "src" / "data" / "roadmaps.json"

REQUIRED_LEVELS = ("beginner", "intermediate", "advanced")
GOAL_IDS = ("job", "freelance", "switch", "skill")  # must match src/data/options.js
PLACEHOLDERS = ("capstone", "roles")             # filled in from the track by src/lib/plan.js
MIN_GOAL_WEEKS, MAX_GOAL_WEEKS = 2, 6
ARROWS = "←→⟵⟶⇐⇒"
MIN_ITEMS, MAX_ITEMS = 3, 8
MIN_WEEKS, MAX_WEEKS = 1, 12          # per phase, at ~15 hours/week
MIN_TOTAL, MAX_TOTAL = 12, 36         # per roadmap, at ~15 hours/week

# Sites that were shut down or moved. Key = URL prefix, value = what to use.
RETIRED = {
    "https://learn.hashicorp.com": "https://developer.hashicorp.com/terraform/tutorials",
    "https://paperswithcode.com": "https://huggingface.co/papers",
    "https://university.mongodb.com": "https://learn.mongodb.com",
    "https://huggingface.co/course": "https://huggingface.co/learn",
    "https://lab.github.com": "https://skills.github.com",
    "https://offensive-security.com": "https://www.offsec.com",
    "https://developer.mozilla.org/ar/": "https://developer.mozilla.org/en-US/docs/Learn",
}


@dataclass
class Report:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    def error(self, where: str, msg: str) -> None:
        self.errors.append(f"{where}: {msg}")

    def warn(self, where: str, msg: str) -> None:
        self.warnings.append(f"{where}: {msg}")

    @property
    def ok(self) -> bool:
        return not self.errors


def _nonempty_str(value) -> bool:
    return isinstance(value, str) and value.strip() != ""


def _placeholders(text) -> list[str]:
    """Names used as {name} inside a topic text."""
    if not isinstance(text, str):
        return []
    return re.findall(r"\{([^{}]*)\}", text)


def check_resource(where: str, res, report: Report) -> None:
    if not isinstance(res, dict):
        report.error(where, "resource must be an object with name and url")
        return
    if not _nonempty_str(res.get("name")):
        report.error(where, "resource has no name")
    url = res.get("url")
    if not _nonempty_str(url):
        report.error(where, "resource has no url")
        return
    if not url.startswith("https://"):
        report.error(where, f"url must start with https:// ({url})")
    for prefix, replacement in RETIRED.items():
        if url.startswith(prefix):
            report.error(where, f"{url} is retired/moved, use {replacement}")


def check_phase(where: str, phase, report: Report) -> int:
    """Validate one phase. Returns its number of weeks (0 when invalid)."""
    if not isinstance(phase, dict):
        report.error(where, "phase must be an object")
        return 0
    if not _nonempty_str(phase.get("title")):
        report.error(where, "phase has no title")

    weeks = phase.get("weeks")
    if not isinstance(weeks, int) or isinstance(weeks, bool):
        report.error(where, f"weeks must be a whole number, got {weeks!r}")
        weeks = 0
    elif not MIN_WEEKS <= weeks <= MAX_WEEKS:
        report.error(where, f"weeks={weeks} is outside {MIN_WEEKS}-{MAX_WEEKS}")

    items = phase.get("items")
    if not isinstance(items, list) or not items:
        report.error(where, "phase has no topics (items)")
        items = []
    else:
        if not MIN_ITEMS <= len(items) <= MAX_ITEMS:
            report.error(where, f"{len(items)} topics, expected {MIN_ITEMS}-{MAX_ITEMS}")
        if any(not _nonempty_str(i) for i in items):
            report.error(where, "empty topic text")
        seen = set()
        for item in items:
            if item in seen:
                report.error(where, f"duplicate topic: {item}")
            seen.add(item)
            if isinstance(item, str) and any(a in item for a in ARROWS):
                report.warn(where, f"arrow in topic may render reversed in RTL: {item}")
            for name in _placeholders(item):
                if name not in PLACEHOLDERS:
                    report.error(where, f"unknown placeholder {{{name}}} in: {item}")

    resources = phase.get("resources")
    if not isinstance(resources, list) or not resources:
        report.error(where, "phase has no resources")
    else:
        urls = set()
        for n, res in enumerate(resources, 1):
            check_resource(f"{where} resource {n}", res, report)
            url = res.get("url") if isinstance(res, dict) else None
            if url in urls:
                report.error(where, f"duplicate resource url {url}")
            urls.add(url)
        if len(resources) == 1:
            report.warn(where, "only one resource (2+ gives learners a fallback)")
    return weeks


def check_data(data, report: Report | None = None) -> Report:
    report = report or Report()
    if not isinstance(data, dict):
        report.error("root", "data must be an object")
        return report

    tracks = data.get("tracks")
    roadmaps = data.get("roadmaps")
    if not isinstance(tracks, list) or not tracks:
        report.error("root", "missing 'tracks' list")
        tracks = []
    if not isinstance(roadmaps, dict):
        report.error("root", "missing 'roadmaps' object")
        roadmaps = {}

    ids = []
    for n, track in enumerate(tracks, 1):
        where = f"tracks[{n}]"
        if not isinstance(track, dict):
            report.error(where, "track must be an object")
            continue
        for key in ("id", "name", "icon", "desc"):
            if not _nonempty_str(track.get(key)):
                report.error(where, f"missing '{key}'")
        for key in PLACEHOLDERS:
            if not _nonempty_str(track.get(key)):
                report.error(where, f"missing '{key}' (used by the goal phase)")
        if track.get("id") in ids:
            report.error(where, f"duplicate track id {track.get('id')}")
        ids.append(track.get("id"))

    for track_id in ids:
        if track_id not in roadmaps:
            report.error(track_id, "track has no roadmap")
    for track_id in roadmaps:
        if track_id not in ids:
            report.warn(track_id, "roadmap exists but the track is not listed in 'tracks'")

    for track_id, levels in roadmaps.items():
        if not isinstance(levels, dict):
            report.error(track_id, "roadmap must map level -> phases")
            continue
        for level in REQUIRED_LEVELS:
            if level not in levels:
                report.error(track_id, f"missing level '{level}'")
        for level, phases in levels.items():
            where = f"{track_id}/{level}"
            if not isinstance(phases, list) or not phases:
                report.error(where, "no phases")
                continue
            if not 3 <= len(phases) <= 6:
                report.warn(where, f"{len(phases)} phases (3-6 reads best)")
            total = sum(
                check_phase(f"{where} phase {i}", ph, report)
                for i, ph in enumerate(phases, 1)
            )
            if total and not MIN_TOTAL <= total <= MAX_TOTAL:
                report.warn(where, f"total {total} weeks, expected {MIN_TOTAL}-{MAX_TOTAL}")
            if any(_placeholders(i) for ph in phases if isinstance(ph, dict) for i in ph.get("items") or []):
                report.error(where, "placeholders like {capstone} only work in goal phases")

    check_goals(data.get("goals"), report)
    return report


def check_goals(goals, report: Report) -> None:
    """The closing phase that is added to every plan, one per wizard goal."""
    if not isinstance(goals, dict):
        report.error("goals", "missing 'goals' object (one closing phase per goal)")
        return
    for goal in GOAL_IDS:
        if goal not in goals:
            report.error("goals", f"missing goal '{goal}'")
    for goal, phase in goals.items():
        where = f"goals/{goal}"
        if goal not in GOAL_IDS:
            report.warn(where, "goal is not offered in the wizard")
        weeks = check_phase(where, phase, report)
        if weeks and not MIN_GOAL_WEEKS <= weeks <= MAX_GOAL_WEEKS:
            report.error(where, f"weeks={weeks} is outside {MIN_GOAL_WEEKS}-{MAX_GOAL_WEEKS}")


def all_urls(data) -> list[str]:
    urls = set()
    phases = [ph for levels in data.get("roadmaps", {}).values() for level in levels.values() for ph in level]
    phases += list((data.get("goals") or {}).values())
    for phase in phases:
        for res in phase.get("resources", []):
            if isinstance(res, dict) and _nonempty_str(res.get("url")):
                urls.add(res["url"])
    return sorted(urls)


def probe(url: str, timeout: float = 15.0) -> tuple[str, str]:
    """Return (url, problem); problem is '' when the link works."""
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (it-roadmap link check)"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return url, "" if resp.status < 400 else f"HTTP {resp.status}"
    except urllib.error.HTTPError as exc:
        # Some sites block scripts (403/429) but work in a browser.
        if exc.code in (403, 429):
            return url, ""
        return url, f"HTTP {exc.code}"
    except Exception as exc:  # network errors, timeouts, bad TLS
        return url, f"{type(exc).__name__}: {exc}"[:120]


def check_links(data, report: Report, workers: int = 8) -> None:
    with concurrent.futures.ThreadPoolExecutor(workers) as pool:
        for url, problem in pool.map(probe, all_urls(data)):
            if problem:
                report.warn("link", f"{url} -> {problem}")


def summary(data) -> str:
    lines = [f"{'track':<11} {'level':<13} phases weeks topics resources"]
    for track_id, levels in data.get("roadmaps", {}).items():
        for level, phases in levels.items():
            weeks = sum(p.get("weeks", 0) for p in phases)
            topics = sum(len(p.get("items", [])) for p in phases)
            res = sum(len(p.get("resources", [])) for p in phases)
            lines.append(f"{track_id:<11} {level:<13} {len(phases):>6} {weeks:>5} {topics:>6} {res:>9}")
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("path", nargs="?", default=str(DEFAULT_DATA), help="roadmaps.json to check")
    parser.add_argument("--links", action="store_true", help="also check every URL over the network")
    parser.add_argument("--summary", action="store_true", help="print a table of phases/weeks per roadmap")
    args = parser.parse_args(argv)

    try:
        data = json.loads(Path(args.path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"ERROR: cannot read {args.path}: {exc}")
        return 1

    report = check_data(data)
    if args.links:
        check_links(data, report)
    if args.summary:
        print(summary(data))
        print()
    for w in report.warnings:
        print(f"WARN  {w}")
    for e in report.errors:
        print(f"ERROR {e}")
    print(f"{len(report.errors)} error(s), {len(report.warnings)} warning(s), {len(all_urls(data))} unique links")
    return 0 if report.ok else 1


if __name__ == "__main__":
    sys.exit(main())
