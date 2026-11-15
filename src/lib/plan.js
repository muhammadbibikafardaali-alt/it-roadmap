// Pure helpers that turn the wizard answers into a personal plan.
// No React here, so everything can be unit-tested with `node --test`.

import data from "../data/roadmaps.json" with { type: "json" };

export const TRACKS = data.tracks;
export const ROADMAPS = data.roadmaps;
export const GOAL_PHASES = data.goals;

// Phase lengths in roadmaps.json are written for a learner who studies
// about 15 hours per week (a serious part-time pace). Everything else is
// scaled from that, e.g. a beginner frontend roadmap is ~330 study hours.
export const BASE_HOURS = 15;

// Real progress does not scale linearly with time: 40 h/week is not 4x
// faster than 10 h/week (fatigue, review, practice). These are the
// "effective" hours used for the estimate.
const EFFECTIVE_HOURS = { 5: 5, 10: 10, 20: 18, 40: 30 };

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
export function toArabicDigits(value) {
  return String(value).replace(/[0-9]/g, (d) => AR_DIGITS[d]);
}

// Arabic counting form for weeks: ١ أسبوع، أسبوعين، ٣–١٠ أسابيع، ١١+ أسبوعاً
export function formatWeeks(n) {
  if (n === 1) return "أسبوع واحد";
  if (n === 2) return "أسبوعين";
  if (n >= 3 && n <= 10) return `${toArabicDigits(n)} أسابيع`;
  return `${toArabicDigits(n)} أسبوعاً`;
}

export function formatMonths(weeks) {
  const months = Math.max(1, Math.round(weeks / 4.345));
  if (months === 1) return "شهر تقريباً";
  if (months === 2) return "شهرين تقريباً";
  if (months <= 10) return `${toArabicDigits(months)} أشهر تقريباً`;
  return `${toArabicDigits(months)} شهراً تقريباً`;
}

export function scaleWeeks(baseWeeks, hoursPerWeek) {
  const effective = EFFECTIVE_HOURS[hoursPerWeek] ?? (Number(hoursPerWeek) || BASE_HOURS);
  const factor = BASE_HOURS / (effective > 0 ? effective : BASE_HOURS);
  return Math.max(1, Math.round(baseWeeks * factor));
}

// Which roadmap a level uses, and how the first phase is treated.
//  beginner     -> beginner roadmap
//  basic        -> beginner roadmap, phase 1 becomes a short review
//  intermediate -> intermediate roadmap
//  advanced     -> advanced roadmap
export function levelPlan(level) {
  switch (level) {
    case "basic":
      return { path: "beginner", reviewFirst: true };
    case "intermediate":
      return { path: "intermediate", reviewFirst: false };
    case "advanced":
      return { path: "advanced", reviewFirst: false };
    default:
      return { path: "beginner", reviewFirst: false };
  }
}

// The level to suggest once every topic of the current plan is done.
const NEXT_LEVEL = { beginner: "intermediate", basic: "intermediate", intermediate: "advanced" };
export function nextLevel(level) {
  return NEXT_LEVEL[level] ?? null;
}

// Goal phases may say "{capstone}" or "{roles}"; the track fills them in.
export function fillPlaceholders(text, track) {
  return text.replace(/\{(\w+)\}/g, (match, name) => (typeof track[name] === "string" ? track[name] : match));
}

/** The closing phase for the learner's goal (job, freelance, ...), or null. */
export function goalPhase(goal, track) {
  const src = GOAL_PHASES?.[goal];
  if (!src) return null;
  return { ...src, items: src.items.map((it) => fillPlaceholders(it, track)), goal };
}

/**
 * Build the personal plan.
 * @param {{track:string, level:string, hours:string}} answers
 * @param {Date} [start] the day the learner starts (default: today)
 */
export function buildPlan(answers, start = new Date()) {
  const track = TRACKS.find((t) => t.id === answers.track) ?? TRACKS[0];
  const { path, reviewFirst } = levelPlan(answers.level);
  const source = ROADMAPS[track.id]?.[path] ?? ROADMAPS[TRACKS[0].id].beginner;
  const hours = Number(answers.hours) || BASE_HOURS;

  let week = 1;
  const phases = source.map((ph, index) => {
    const review = reviewFirst && index === 0;
    const base = review ? Math.ceil(ph.weeks / 2) : ph.weeks;
    const weeks = scaleWeeks(base, hours);
    const phase = {
      ...ph,
      index,
      number: index + 1,
      review,
      weeks,
      fromWeek: week,
      toWeek: week + weeks - 1,
      key: `${track.id}:${path}:${index}`,
    };
    week += weeks;
    return phase;
  });

  // Every plan ends with the learner's goal: first job, first client, ...
  const closing = goalPhase(answers.goal, track);
  if (closing) {
    const weeks = scaleWeeks(closing.weeks, hours);
    phases.push({
      ...closing,
      index: phases.length,
      number: phases.length + 1,
      review: false,
      weeks,
      fromWeek: week,
      toWeek: week + weeks - 1,
      key: `${track.id}:goal-${closing.goal}`,
    });
    week += weeks;
  }

  const totalWeeks = week - 1;
  const finish = new Date(start);
  finish.setDate(finish.getDate() + totalWeeks * 7);
  return {
    track,
    path,
    phases,
    totalWeeks,
    totalHours: totalWeeks * hours,
    finish,
  };
}

export function formatMonthYear(date) {
  try {
    return toArabicDigits(new Intl.DateTimeFormat("ar-SY", { month: "long", year: "numeric" }).format(date));
  } catch {
    return `${toArabicDigits(date.getMonth() + 1)}/${toArabicDigits(date.getFullYear())}`;
  }
}

// ---- progress (which topics are ticked) ----

export function itemKey(phase, itemIndex) {
  return `${phase.key}:${itemIndex}`;
}

export function progressOf(plan, done) {
  let total = 0;
  let checked = 0;
  const perPhase = plan.phases.map((ph) => {
    const n = ph.items.length;
    const c = ph.items.filter((_, i) => done[itemKey(ph, i)]).length;
    total += n;
    checked += c;
    return { done: c, total: n, complete: c === n };
  });
  return { perPhase, done: checked, total, percent: total ? Math.round((checked / total) * 100) : 0 };
}

// ---- share links: answers <-> URL query string ----

const PARAMS = { t: "track", l: "level", h: "hours", g: "goal", o: "obstacle", d: "device" };
const VALID = {
  track: TRACKS.map((t) => t.id),
  level: ["beginner", "basic", "intermediate", "advanced"],
  hours: ["5", "10", "20", "40"],
  goal: ["job", "freelance", "skill", "switch"],
  obstacle: ["sources", "branch", "motivation", "noplan"],
  device: ["pc", "mobile", "both"],
};

export function answersToQuery(answers) {
  const q = new URLSearchParams();
  for (const [short, long] of Object.entries(PARAMS)) {
    if (answers[long]) q.set(short, answers[long]);
  }
  return q.toString();
}

/** Returns valid answers from a query string, or null when it is not a complete plan. */
export function answersFromQuery(search) {
  const q = new URLSearchParams(search);
  const answers = {};
  for (const [short, long] of Object.entries(PARAMS)) {
    const v = q.get(short);
    if (v && VALID[long].includes(v)) answers[long] = v;
  }
  return answers.track && answers.level && answers.hours ? answers : null;
}

export function isComplete(answers) {
  return ["track", "level", "hours", "goal", "obstacle", "device"].every(
    (k) => answers?.[k] && VALID[k].includes(answers[k]),
  );
}
