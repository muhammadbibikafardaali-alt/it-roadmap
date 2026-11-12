// Run with: npm test   (uses Node's built-in test runner, no extra packages)
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  answersFromQuery,
  answersToQuery,
  buildPlan,
  formatMonths,
  formatWeeks,
  isComplete,
  itemKey,
  levelPlan,
  progressOf,
  scaleWeeks,
  toArabicDigits,
  TRACKS,
  ROADMAPS,
} from "./plan.js";

const full = { track: "cyber", level: "beginner", hours: "10", goal: "job", obstacle: "motivation", device: "pc" };

test("arabic digits and week wording", () => {
  assert.equal(toArabicDigits(2027), "٢٠٢٧");
  assert.equal(formatWeeks(1), "أسبوع واحد");
  assert.equal(formatWeeks(2), "أسبوعين");
  assert.equal(formatWeeks(4), "٤ أسابيع");
  assert.equal(formatWeeks(12), "١٢ أسبوعاً");
  assert.equal(formatMonths(4), "شهر تقريباً");
  assert.equal(formatMonths(26), "٦ أشهر تقريباً");
});

test("weeks scale with study hours, never below one week", () => {
  assert.equal(scaleWeeks(4, "10"), 6);
  assert.equal(scaleWeeks(4, "5"), 12);
  assert.equal(scaleWeeks(4, "20"), 3);
  assert.equal(scaleWeeks(4, "40"), 2);
  assert.equal(scaleWeeks(1, "40"), 1);
  assert.equal(scaleWeeks(6, "nonsense"), 6);
});

test("levels pick the right roadmap", () => {
  assert.deepEqual(levelPlan("beginner"), { path: "beginner", reviewFirst: false });
  assert.deepEqual(levelPlan("basic"), { path: "beginner", reviewFirst: true });
  assert.deepEqual(levelPlan("intermediate"), { path: "intermediate", reviewFirst: false });
  assert.deepEqual(levelPlan("advanced"), { path: "intermediate", reviewFirst: true });
});

test("plan timeline is continuous and totals add up", () => {
  for (const track of TRACKS) {
    for (const level of ["beginner", "basic", "intermediate", "advanced"]) {
      for (const hours of ["5", "10", "20", "40"]) {
        const plan = buildPlan({ track: track.id, level, hours }, new Date(2027, 0, 1));
        assert.equal(plan.track.id, track.id);
        let expected = 1;
        for (const ph of plan.phases) {
          assert.equal(ph.fromWeek, expected);
          assert.ok(ph.toWeek >= ph.fromWeek);
          expected = ph.toWeek + 1;
        }
        assert.equal(plan.totalWeeks, expected - 1);
        assert.equal(plan.totalHours, plan.totalWeeks * Number(hours));
      }
    }
  }
});

test("more hours per week means a shorter plan", () => {
  const slow = buildPlan({ ...full, hours: "5" });
  const fast = buildPlan({ ...full, hours: "40" });
  assert.ok(slow.totalWeeks > fast.totalWeeks * 3);
});

test("basic level shortens phase one into a review", () => {
  const beginner = buildPlan({ ...full, level: "beginner" });
  const basic = buildPlan({ ...full, level: "basic" });
  assert.equal(basic.phases[0].review, true);
  assert.equal(beginner.phases[0].review, false);
  assert.ok(basic.phases[0].weeks < beginner.phases[0].weeks);
  assert.equal(basic.phases[1].weeks, beginner.phases[1].weeks);
});

test("unknown track falls back to the first track", () => {
  const plan = buildPlan({ track: "nope", level: "beginner", hours: "10" });
  assert.equal(plan.track.id, TRACKS[0].id);
  assert.equal(plan.phases.length, ROADMAPS[TRACKS[0].id].beginner.length);
});

test("finish date is start + total weeks", () => {
  const start = new Date(2027, 0, 1);
  const plan = buildPlan(full, start);
  assert.equal(Math.round((plan.finish - start) / 86400000), plan.totalWeeks * 7);
});

test("progress counts ticked topics per phase", () => {
  const plan = buildPlan(full);
  const first = plan.phases[0];
  const done = {};
  first.items.forEach((_, i) => (done[itemKey(first, i)] = true));
  done[itemKey(plan.phases[1], 0)] = true;
  const p = progressOf(plan, done);
  assert.equal(p.perPhase[0].complete, true);
  assert.equal(p.perPhase[1].done, 1);
  assert.equal(p.done, first.items.length + 1);
  assert.ok(p.percent > 0 && p.percent < 100);
  assert.equal(progressOf(plan, {}).percent, 0);
});

test("share link round-trips and rejects bad values", () => {
  const q = answersToQuery(full);
  assert.deepEqual(answersFromQuery(q), full);
  assert.equal(answersFromQuery("t=cyber&l=beginner"), null, "hours missing");
  assert.equal(answersFromQuery("t=hack&l=beginner&h=10"), null, "unknown track");
  assert.deepEqual(answersFromQuery("t=data&l=basic&h=20&g=evil"), { track: "data", level: "basic", hours: "20" });
  assert.equal(isComplete(full), true);
  assert.equal(isComplete({ ...full, device: undefined }), false);
});
