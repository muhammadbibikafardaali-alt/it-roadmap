import { B } from "../theme.js";
import { TRACKS } from "../lib/plan.js";
import { DEVICES, GOALS, HOURS, LEVELS, OBSTACLES } from "../data/options.js";

// One selectable answer. Behaves as a radio button for screen readers and keyboards.
export function Opt({ selected, onClick, title, desc, icon, small }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={!!selected}
      onClick={onClick}
      className="opt"
      style={{ background: selected ? `linear-gradient(135deg,${B.or}22,${B.or}11)` : B.card, border: `2px solid ${selected ? B.or : B.blL}`, borderRadius: 16, padding: small ? "14px 16px" : "18px 22px", cursor: "pointer", textAlign: "right", direction: "rtl", width: "100%", display: "flex", alignItems: "center", gap: 14, position: "relative", overflow: "hidden", minHeight: 56 }}
    >
      {selected && <div style={{ position: "absolute", top: 0, right: 0, width: 4, height: "100%", background: B.or }} />}
      {icon && <span aria-hidden="true" style={{ fontSize: small ? 24 : 30, flexShrink: 0 }}>{icon}</span>}
      <div style={{ flex: 1 }}>
        <div style={{ color: B.w, fontSize: small ? 15 : 17, fontWeight: 600, marginBottom: desc ? 4 : 0 }}>{title}</div>
        {desc && <div style={{ color: B.g, fontSize: 13 }}>{desc}</div>}
      </div>
      <div aria-hidden="true" style={{ width: 24, height: 24, borderRadius: 99, border: `2px solid ${selected ? B.or : B.blL}`, background: selected ? B.or : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {selected && <span style={{ color: B.w, fontSize: 13 }}>✓</span>}
      </div>
    </button>
  );
}

function Question({ title, hint, id, children, narrow = true }) {
  return (
    <div style={{ direction: "rtl", maxWidth: narrow ? 520 : "none", margin: "0 auto" }}>
      <h2 id={id} style={{ color: B.w, fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>{title}</h2>
      <p style={{ color: B.g, textAlign: "center", marginBottom: 24, fontSize: 15 }}>{hint}</p>
      {children}
    </div>
  );
}

// A single-choice question. `pick` stores the answer (the wizard may then auto-advance).
function Choice({ field, options, a, pick, title, hint, layout = "list", small, icon }) {
  const labelId = `q-${field}`;
  const grid =
    layout === "grid"
      ? { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 12 }
      : layout === "two"
        ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }
        : { display: "flex", flexDirection: "column", gap: 12 };
  return (
    <Question title={title} hint={hint} id={labelId} narrow={layout !== "grid"}>
      <div role="radiogroup" aria-labelledby={labelId} className={layout === "two" ? "goal-grid" : undefined} style={grid}>
        {options.map((o) => (
          <Opt key={o.id} selected={a[field] === o.id} onClick={() => pick(field, o.id)} title={o.name} desc={o.desc} icon={o.icon ?? icon} small={small} />
        ))}
      </div>
    </Question>
  );
}

// Steps hold small render functions, so they live next to the components they render.
// eslint-disable-next-line react-refresh/only-export-components
export const STEPS = [
  { field: "track", label: "المسار", render: (p) => <Choice {...p} field="track" options={TRACKS} title="اختر مسارك في الـ IT" hint="المسار اللي بدك تتعلمه — بتقدر تغيّره بعدين" layout="grid" small /> },
  { field: "level", label: "المستوى", render: (p) => <Choice {...p} field="level" options={LEVELS} title="شو مستواك الحالي؟" hint="هاد بيحدد نقطة البداية — إذا عندك أساسيات بنختصر المرحلة الأولى لمراجعة" /> },
  { field: "hours", label: "الوقت", render: (p) => <Choice {...p} field="hours" options={HOURS} icon="⏰" title="كم ساعة تقدر تدرس بالأسبوع؟" hint="مدة كل مرحلة بتنحسب حسب وقتك — عشان يطلع جدول واقعي" /> },
  { field: "goal", label: "الهدف", render: (p) => <Choice {...p} field="goal" options={GOALS} title="شو هدفك من التعلم؟" hint="عشان نوجهك صح" layout="two" /> },
  { field: "obstacle", label: "العائق", render: (p) => <Choice {...p} field="obstacle" options={OBSTACLES} title="شو أكتر شي مخليك توقف أو ما تبدأ؟" hint="عشان نعالج هالمشكلة بالخطة" /> },
  { field: "device", label: "الجهاز", render: (p) => <Choice {...p} field="device" options={DEVICES} title="شو الجهاز اللي عندك؟" hint="هاد بيأثر على الخطة والأدوات اللي رح نقترحها" /> },
  { field: null, label: "تفاصيل", render: (p) => <Details {...p} /> },
];

export const MAX_DETAILS = 400;

function Details({ a, setA }) {
  const text = a.details || "";
  return (
    <Question title="أي تفاصيل إضافية؟" hint="اختياري — بتنضاف لخطتك وبتطلع معها لما تطبعها أو تشاركها مع حدا يساعدك" id="q-details">
      <textarea
        aria-labelledby="q-details"
        value={text}
        maxLength={MAX_DETAILS}
        onChange={(e) => setA({ ...a, details: e.target.value })}
        placeholder="مثلاً: بدرس جامعة وعندي امتحانات بشهر ٦، عندي خبرة بالفوتوشوب..."
        style={{ width: "100%", minHeight: 150, background: B.card, border: `2px solid ${B.blL}`, borderRadius: 16, padding: 18, color: B.w, fontSize: 15, direction: "rtl", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.7 }}
      />
      <div style={{ color: B.gD, fontSize: 12, marginTop: 6, textAlign: "left", direction: "ltr" }}>{text.length}/{MAX_DETAILS}</div>
    </Question>
  );
}

// Progress bar + clickable step dots (only answered steps are clickable).
export function StepBar({ step, total, a, goTo }) {
  const pct = Math.round(((step + 1) / total) * 100);
  const reachable = (i) => i <= step || STEPS.slice(0, i).every((s) => !s.field || a[s.field]);
  return (
    <div style={{ width: "100%", maxWidth: 560, margin: "0 auto 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: B.g, fontSize: 14 }}>الخطوة {step + 1} من {total}</span>
        <span style={{ color: B.or, fontSize: 14, fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ background: B.blL, borderRadius: 99, height: 6, overflow: "hidden" }} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="تقدم الأسئلة">
        <div className="bar-fill" style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${B.or},${B.orL})`, borderRadius: 99 }} />
      </div>
      <nav aria-label="خطوات الأسئلة" style={{ display: "flex", justifyContent: "space-between", marginTop: 12, gap: 4 }}>
        {STEPS.map((s, i) => {
          const can = reachable(i);
          const current = i === step;
          const answered = s.field ? !!a[s.field] : i < step;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => can && goTo(i)}
              disabled={!can}
              aria-current={current ? "step" : undefined}
              title={s.label}
              style={{ background: "none", border: "none", cursor: can ? "pointer" : "default", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1, padding: 2, opacity: can ? 1 : 0.45 }}
            >
              <span style={{ width: current ? 14 : 10, height: current ? 14 : 10, borderRadius: 99, background: current ? B.or : answered ? B.orL : B.blL, boxShadow: current ? `0 0 0 4px ${B.or}33` : "none", transition: "all 0.2s" }} />
              <span style={{ color: current ? B.w : B.gD, fontSize: 11, whiteSpace: "nowrap" }}>{s.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
