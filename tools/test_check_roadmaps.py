"""Unit tests for tools/check_roadmaps.py.  Run: python3 -m unittest discover tools"""

import contextlib
import copy
import io
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import check_roadmaps as cr  # noqa: E402


def phase(**over):
    base = {
        "title": "Basics",
        "weeks": 4,
        "items": ["HTML", "CSS", "JavaScript"],
        "resources": [
            {"name": "MDN", "url": "https://developer.mozilla.org/en-US/docs/Learn"},
            {"name": "web.dev", "url": "https://web.dev/learn"},
        ],
    }
    base.update(over)
    return base


def dataset():
    phases = [phase(title=f"P{i}") for i in range(4)]  # 16 weeks total
    goal = phase(title="Goal", weeks=3, items=["Build {capstone}", "Search for {roles}", "Apply"])
    return {
        "tracks": [{"id": "web", "name": "Web", "icon": "🌐", "desc": "HTML", "capstone": "a shop", "roles": "Web Dev"}],
        "roadmaps": {"web": {lvl: copy.deepcopy(phases) for lvl in cr.REQUIRED_LEVELS}},
        "goals": {g: copy.deepcopy(goal) for g in cr.GOAL_IDS},
    }


class CheckDataTests(unittest.TestCase):
    def test_valid_dataset_has_no_errors(self):
        report = cr.check_data(dataset())
        self.assertEqual(report.errors, [])
        self.assertEqual(report.warnings, [])

    def test_real_data_file_passes(self):
        data = json.loads(cr.DEFAULT_DATA.read_text(encoding="utf-8"))
        report = cr.check_data(data)
        self.assertEqual(report.errors, [], "\n".join(report.errors))

    def test_missing_level_is_an_error(self):
        data = dataset()
        del data["roadmaps"]["web"]["intermediate"]
        report = cr.check_data(data)
        self.assertTrue(any("missing level 'intermediate'" in e for e in report.errors))

    def test_advanced_level_is_required(self):
        data = dataset()
        del data["roadmaps"]["web"]["advanced"]
        self.assertIn("web: missing level 'advanced'", cr.check_data(data).errors)

    def test_every_wizard_goal_needs_a_goal_phase(self):
        data = dataset()
        del data["goals"]["freelance"]
        self.assertIn("goals: missing goal 'freelance'", cr.check_data(data).errors)
        del data["goals"]
        self.assertTrue(any("missing 'goals'" in e for e in cr.check_data(data).errors))

    def test_goal_phase_length_is_limited(self):
        data = dataset()
        data["goals"]["job"]["weeks"] = 8
        self.assertTrue(any(e.startswith("goals/job: weeks=8") for e in cr.check_data(data).errors))

    def test_placeholders(self):
        data = dataset()
        data["goals"]["skill"]["items"][0] = "Build {capstne}"
        self.assertTrue(any("unknown placeholder {capstne}" in e for e in cr.check_data(data).errors))
        data = dataset()
        data["roadmaps"]["web"]["beginner"][0]["items"][0] = "Build {capstone}"
        self.assertTrue(any("only work in goal phases" in e for e in cr.check_data(data).errors))

    def test_track_needs_capstone_and_roles(self):
        data = dataset()
        del data["tracks"][0]["roles"]
        self.assertTrue(any("missing 'roles'" in e for e in cr.check_data(data).errors))

    def test_single_resource_and_arrows_are_warnings(self):
        data = dataset()
        first = data["roadmaps"]["web"]["beginner"][0]
        first["resources"] = first["resources"][:1]
        first["items"][0] = "Docker ← Kubernetes"
        report = cr.check_data(data)
        self.assertEqual(report.errors, [])
        self.assertTrue(any("only one resource" in w for w in report.warnings))
        self.assertTrue(any("arrow in topic" in w for w in report.warnings))

    def test_track_without_roadmap(self):
        data = dataset()
        data["tracks"].append({"id": "cloud", "name": "Cloud", "icon": "☁️", "desc": "AWS"})
        report = cr.check_data(data)
        self.assertIn("cloud: track has no roadmap", report.errors)

    def test_weeks_must_be_whole_number_in_range(self):
        for bad in ("4 weeks", 0, 13, 2.5, True):
            data = dataset()
            data["roadmaps"]["web"]["beginner"][0]["weeks"] = bad
            report = cr.check_data(data)
            self.assertTrue(any("weeks" in e for e in report.errors), bad)

    def test_topic_count_and_duplicates(self):
        data = dataset()
        data["roadmaps"]["web"]["beginner"][0]["items"] = ["A", "B"]
        self.assertTrue(any("2 topics" in e for e in cr.check_data(data).errors))
        data["roadmaps"]["web"]["beginner"][0]["items"] = ["A", "B", "A"]
        self.assertTrue(any("duplicate topic" in e for e in cr.check_data(data).errors))

    def test_resource_rules(self):
        data = dataset()
        res = data["roadmaps"]["web"]["beginner"][0]["resources"]
        res.append({"name": "Old", "url": "http://example.com"})
        res.append({"name": "", "url": "https://example.org"})
        res.append({"name": "Dup", "url": "https://example.org"})
        errors = cr.check_data(data).errors
        self.assertTrue(any("https://" in e and "example.com" in e for e in errors))
        self.assertTrue(any("resource has no name" in e for e in errors))
        self.assertTrue(any("duplicate resource url" in e for e in errors))

    def test_retired_site_is_flagged_with_replacement(self):
        data = dataset()
        data["roadmaps"]["web"]["beginner"][0]["resources"] = [
            {"name": "PwC", "url": "https://paperswithcode.com/sota"}
        ]
        errors = cr.check_data(data).errors
        self.assertTrue(any("huggingface.co/papers" in e for e in errors))

    def test_total_weeks_out_of_range_is_only_a_warning(self):
        data = dataset()
        data["roadmaps"]["web"]["beginner"] = [phase(weeks=1)] * 3
        report = cr.check_data(data)
        self.assertEqual(report.errors, [])
        self.assertTrue(any("total 3 weeks" in w for w in report.warnings))

    def test_all_urls_is_unique_and_sorted(self):
        data = dataset()
        data["goals"]["job"]["resources"].append({"name": "Jobs", "url": "https://jobs.example.com"})
        urls = cr.all_urls(data)
        self.assertEqual(urls, ["https://developer.mozilla.org/en-US/docs/Learn", "https://jobs.example.com", "https://web.dev/learn"])

    def test_main_returns_1_on_bad_file(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            bad = Path(tmpdir) / "bad.json"
            bad.write_text("{not json", encoding="utf-8")
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(cr.main([str(bad)]), 1)


if __name__ == "__main__":
    unittest.main()
