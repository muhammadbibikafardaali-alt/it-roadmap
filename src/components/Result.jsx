import { useMemo, useState } from "react";
import { B, card } from "../theme.js";
import { GOALS, HOURS, LEVELS } from "../data/options.js";
import { buildPlan, formatMonthYear, formatMonths, formatWeeks, itemKey, nextLevel, progressOf, toArabicDigits } from "../lib/plan.js";
import { AISection, CommitSection, CourseraSection, DeviceNote, EnglishSection, ObstacleNote, PomodoroSection } from "./Guides.jsx";

function Stat({ label, value, sub }) {
  return (
    <div className="print-card" style={{ background: "rgba(255,255,255,0.14)", borderRadius: 14, padding: "12px 14px", minWidth: 0 }}>
      <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div style={{ color: B.w, fontSize: 18, fontWeight: 800, lineHeight: 1.3 }}>{value}</div>
      {sub && <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Bar({ percent, color = B.or, height = 6, label }) {
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={label} style={{ background: `${B.blL}`, borderRadius: 99, height, overflow: "hidden" }}>
      <div className="bar-fill" style={{ width: `${percent}%`, height: "100%", background: color, borderRadius: 99 }} />
    </div>
  );
}

function Topic({ text, checked, onToggle }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className={`topic${checked ? " topic-done" : ""}`}
      style={{ display: "flex", alignItems: "flex-start", gap: 10, width: "100%", background: "transparent", border: "none", borderRadius: 10, padding: "8px 8px", cursor: "pointer", textAlign: "right", direction: "rtl" }}
    >
      <span aria-hidden="true" className={checked ? "tick-on" : undefined} style={{ width: 22, height: 22, borderRadius: 7, border: `2px solid ${checked ? B.ok : B.blL}`, background: checked ? B.ok : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
        {checked && <span style={{ color: B.w, fontSize: 13, fontWeight: 800 }}>✓</span>}
      </span>
      <span className="topic-text" style={{ color: B.gL, fontSize: 14, lineHeight: 1.6 }}>{text}</span>
    </button>
  );
}

function Phase({ ph, prog, done, toggle, hours, last }) {
  const pct = Math.round((prog.done / prog.total) * 100);
  const accent = ph.goal ? B.ok : B.or;
  const range = ph.fromWeek === ph.toWeek ? `الأسبوع ${toArabicDigits(ph.fromWeek)}` : `الأسابيع ${toArabicDigits(ph.fromWeek)}–${toArabicDigits(ph.toWeek)}`;
  return (
    <li style={{ display: "flex", gap: 14, listStyle: "none" }}>
      {/* timeline rail */}
      <div aria-hidden="true" className="no-print" style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 36 }}>
        <div style={{ width: 36, height: 36, borderRadius: 99, background: prog.complete ? B.ok : accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: B.w, boxShadow: `0 0 0 4px ${prog.complete ? B.ok : accent}22`, transition: "background 0.3s" }}>
          {prog.complete ? "✓" : ph.goal ? "🎯" : toArabicDigits(ph.number)}
        </div>
        {!last && <div style={{ flex: 1, width: 2, background: `linear-gradient(${B.or}88,${B.blL})`, marginTop: 4, minHeight: 20 }} />}
      </div>

      <section className={`print-card${ph.goal ? " goal-phase" : ""}`} aria-labelledby={`ph-${ph.key}`} style={{ ...card({ marginBottom: 18 }), flex: 1, minWidth: 0, borderColor: prog.complete || ph.goal ? `${B.ok}66` : B.blL }}>
        <header style={{ background: ph.goal ? `linear-gradient(90deg,${B.bl},${B.ok}33)` : `linear-gradient(90deg,${B.bl},${B.blL})`, padding: "14px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
            <h3 id={`ph-${ph.key}`} style={{ color: B.w, fontSize: 18, fontWeight: 700, margin: 0 }}>
              <span style={{ color: accent }}>{ph.goal ? "مرحلة هدفك" : `المرحلة ${toArabicDigits(ph.number)}`}: </span>{ph.title}
            </h3>
            <span style={{ color: B.or, fontSize: 13, fontWeight: 600, background: `${B.or}22`, padding: "4px 12px", borderRadius: 99, whiteSpace: "nowrap" }}>{formatWeeks(ph.weeks)}</span>
          </div>
          <div style={{ color: B.g, fontSize: 12, marginTop: 6 }}>
            {range} · حوالي {toArabicDigits(ph.weeks * hours)} ساعة
          </div>
          {ph.goal && (
            <div style={{ marginTop: 10, color: B.gL, fontSize: 13, lineHeight: 1.6 }}>
              هاي المرحلة مبنية على هدفك — فيك تبلّش فيها بالتوازي مع آخر مرحلتين.
            </div>
          )}
          {ph.review && (
            <div style={{ marginTop: 10, background: `${B.warn}18`, border: `1px solid ${B.warn}44`, color: B.warn, borderRadius: 10, padding: "8px 12px", fontSize: 13, lineHeight: 1.6 }}>
              🔁 مراجعة سريعة: إنت بتعرف جزء من هالمواضيع — علّم اللي بتتقنه كمنجز وركّز وقتك على الباقي.
            </div>
          )}
        </header>
        <div style={{ padding: "14px 14px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", marginBottom: 6 }}>
            <h4 style={{ color: B.g, fontSize: 13, fontWeight: 600, margin: 0 }}>المواضيع — علّم اللي خلصته</h4>
            <span style={{ color: prog.complete ? B.ok : B.g, fontSize: 12, fontWeight: 700 }}>{toArabicDigits(prog.done)}/{toArabicDigits(prog.total)}</span>
          </div>
          <div style={{ padding: "0 8px 8px" }} className="no-print"><Bar percent={pct} color={prog.complete ? B.ok : B.or} height={4} label={`تقدم المرحلة ${ph.number}`} /></div>
          {ph.items.map((it, j) => (
            <Topic key={j} text={it} checked={!!done[itemKey(ph, j)]} onToggle={() => toggle(itemKey(ph, j))} />
          ))}
          <h4 style={{ color: B.g, fontSize: 13, fontWeight: 600, margin: "16px 8px 10px" }}>مصادر مختارة</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 8px" }}>
            {ph.resources.map((r, j) => (
              <a key={j} className="res-link" href={r.url} target="_blank" rel="noopener noreferrer" style={{ background: `${B.or}12`, color: B.orL, fontSize: 13, padding: "9px 14px", borderRadius: 12, fontWeight: 500, textDecoration: "none", display: "block" }}>
                📚 {r.name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </li>
  );
}

const GUIDES = [
  { id: "ai", label: "🤖 الـ AI", C: AISection },
  { id: "commit", label: "🎯 الالتزام", C: CommitSection },
  { id: "pomo", label: "⏱️ تنظيم الوقت", C: PomodoroSection },
  { id: "en", label: "🌍 الإنجليزي", C: EnglishSection },
  { id: "coursera", label: "🎓 منح كورسيرا", C: CourseraSection },
];

function GuideTabs() {
  const [tab, setTab] = useState(GUIDES[0].id);
  const onKey = (e) => {
    const i = GUIDES.findIndex((g) => g.id === tab);
    // RTL: ArrowLeft moves to the next tab, ArrowRight to the previous one.
    const delta = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = GUIDES[(i + delta + GUIDES.length) % GUIDES.length];
    setTab(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };
  return (
    <section aria-label="دليل الدراسة" style={{ marginTop: 28 }}>
      <h2 style={{ color: B.w, fontSize: 22, fontWeight: 800, marginBottom: 12 }}>📘 دليل الدراسة</h2>
      <div role="tablist" aria-label="أقسام دليل الدراسة" className="tabs no-print" onKeyDown={onKey} style={{ marginBottom: 14 }}>
        {GUIDES.map((g) => {
          const active = g.id === tab;
          return (
            <button key={g.id} id={`tab-${g.id}`} type="button" role="tab" aria-selected={active} aria-controls={`panel-${g.id}`} tabIndex={active ? 0 : -1} onClick={() => setTab(g.id)} className="tab btn"
              style={{ background: active ? B.or : B.card, color: B.w, border: `1px solid ${active ? B.or : B.blL}`, padding: "9px 16px", borderRadius: 99, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              {g.label}
            </button>
          );
        })}
      </div>
      {GUIDES.map(({ id, C }) => (
        <div key={id} id={`panel-${id}`} role="tabpanel" aria-labelledby={`tab-${id}`} hidden={id !== tab} className="guide-panel step-in">
          <C />
        </div>
      ))}
    </section>
  );
}

export function Result({ a, tips, done, toggle, startDate, onShare, onPrint, onEdit, onRestart, onLevelUp }) {
  const plan = useMemo(() => buildPlan(a, startDate ? new Date(startDate) : new Date()), [a, startDate]);
  const prog = progressOf(plan, done);
  const hours = Number(a.hours) || 15;
  const lv = LEVELS.find((l) => l.id === a.level);
  const hr = HOURS.find((h) => h.id === a.hours);
  const gl = GOALS.find((g) => g.id === a.goal);
  const nextPhase = plan.phases.find((_, i) => !prog.perPhase[i].complete);
  const upLevel = LEVELS.find((l) => l.id === nextLevel(a.level));

  const btn = (primary) => ({ background: primary ? `linear-gradient(135deg,${B.or},${B.orD})` : B.blL, color: B.w, border: "none", padding: "11px 18px", borderRadius: 99, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: primary ? `0 4px 16px ${B.or}44` : "none" });

  return (
    <div style={{ direction: "rtl", maxWidth: 820, margin: "0 auto" }} className="step-in">
      <div className="print-card" style={{ background: `linear-gradient(135deg,${B.or},${B.orD})`, borderRadius: 20, padding: "28px 24px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: -30, left: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span aria-hidden="true" style={{ fontSize: 40 }}>{plan.track.icon}</span>
            <div>
              <h1 style={{ color: B.w, fontSize: 26, fontWeight: 800, margin: 0 }}>خارطة طريقك المخصصة</h1>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 16, margin: "4px 0 0" }}>{plan.track.name}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {[{ l: "المستوى", v: lv?.name }, { l: "الوقت", v: hr?.name }, { l: "الهدف", v: gl?.name }].map((t) => (
              <span key={t.l} style={{ background: "rgba(255,255,255,0.2)", borderRadius: 99, padding: "5px 12px", fontSize: 13, color: B.w, fontWeight: 500 }}>{t.l}: {t.v}</span>
            ))}
          </div>
          <div className="stats">
            <Stat label="المدة الكلية" value={formatWeeks(plan.totalWeeks)} sub={formatMonths(plan.totalWeeks)} />
            <Stat label="بتخلص تقريباً" value={formatMonthYear(plan.finish)} sub="إذا التزمت بوقتك" />
            <Stat label="ساعات الدراسة" value={`${toArabicDigits(plan.totalHours)} ساعة`} sub={`${toArabicDigits(plan.phases.length)} مراحل`} />
            <Stat label="تقدمك" value={`${toArabicDigits(prog.percent)}٪`} sub={`${toArabicDigits(prog.done)} من ${toArabicDigits(prog.total)} موضوع`} />
          </div>
          <div style={{ marginTop: 14 }} className="no-print"><Bar percent={prog.percent} color="#fff" height={8} label="تقدمك بالخطة كلها" /></div>
        </div>
      </div>

      <div className="no-print" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        <button type="button" className="btn" onClick={onShare} style={btn(true)}>🔗 شارك الخطة</button>
        <button type="button" className="btn" onClick={onPrint} style={btn(false)}>🖨️ اطبع / احفظ PDF</button>
        <button type="button" className="btn" onClick={onEdit} style={btn(false)}>✏️ عدّل إجاباتك</button>
        <button type="button" className="btn" onClick={onRestart} style={btn(false)}>🔄 ابدأ من جديد</button>
      </div>

      {nextPhase && prog.done > 0 && (
        <div className="no-print" style={{ ...card({ border: `1px solid ${B.ok}55` }), padding: "14px 18px", color: B.gL, fontSize: 14 }}>
          👣 خطوتك الجاية: <strong style={{ color: B.w }}>المرحلة {toArabicDigits(nextPhase.number)} — {nextPhase.title}</strong>
        </div>
      )}
      {!nextPhase && (
        <div style={{ ...card({ border: `1px solid ${B.ok}` }), padding: "18px 20px", color: B.w, textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>🎉 مبروك! خلصت كل مواضيع الخطة.</div>
          {upLevel && onLevelUp ? (
            <>
              <p style={{ color: B.gL, fontSize: 14, margin: "8px 0 12px", lineHeight: 1.7 }}>جاهز للخطوة الجاية؟ المستوى «{upLevel.name}» بيكمّل من وين وقفت.</p>
              <button type="button" className="btn no-print" onClick={() => onLevelUp(upLevel.id)} style={btn(true)}>🚀 انتقل لمستوى {upLevel.name}</button>
            </>
          ) : (
            <p style={{ color: B.gL, fontSize: 14, margin: "8px 0 0", lineHeight: 1.7 }}>خلصت المسار المتقدم — وقت تعلّم غيرك وتختار تخصص جديد.</p>
          )}
        </div>
      )}

      {a.details?.trim() && (
        <div className="print-card" style={{ ...card(), padding: "14px 18px" }}>
          <div style={{ color: B.g, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>📝 ملاحظاتك</div>
          <p style={{ color: B.gL, fontSize: 14, lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>{a.details}</p>
        </div>
      )}

      {tips?.length > 0 && (
        <div className="print-card" style={{ ...card(), border: `1px solid ${B.or}33` }}>
          <div style={{ padding: 20 }}>
            <h2 style={{ color: B.or, fontSize: 18, fontWeight: 700, marginBottom: 14 }}>💡 نصائح مخصصة بناءً على إجاباتك</h2>
            {tips.map((t, i) => (
              <div key={i} style={{ background: `${B.or}11`, borderRadius: 12, padding: "12px 16px", marginBottom: 8, borderRight: `3px solid ${B.or}`, color: B.gL, fontSize: 14, lineHeight: 1.7 }}>{t}</div>
            ))}
          </div>
        </div>
      )}

      <h2 style={{ color: B.w, fontSize: 22, fontWeight: 800, margin: "28px 0 6px" }}>🗺️ مراحل الخطة</h2>
      <p style={{ color: B.g, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
        المدة محسوبة على {hr?.name ?? "وقتك"}. علّم كل موضوع بتخلصه — تقدمك بينحفظ على هالجهاز.
      </p>
      <ol style={{ padding: 0, margin: 0 }}>
        {plan.phases.map((ph, i) => (
          <Phase key={ph.key} ph={ph} prog={prog.perPhase[i]} done={done} toggle={toggle} hours={hours} last={i === plan.phases.length - 1} />
        ))}
      </ol>

      <div style={{ marginTop: 12 }}>
        <ObstacleNote obstacle={a.obstacle} />
        <DeviceNote device={a.device} />
      </div>
      <GuideTabs />

      <div className="no-print" style={{ background: `linear-gradient(135deg,${B.card},${B.blD})`, borderRadius: 16, padding: 28, marginTop: 24, textAlign: "center", border: `1px solid ${B.or}33` }}>
        <h3 style={{ color: B.w, fontSize: 22, fontWeight: 700, marginBottom: 12 }}>🚀 بدك خارطة طريق مفصّلة ومخصصة بالكامل؟</h3>
        <p style={{ color: B.gL, fontSize: 15, marginBottom: 8, lineHeight: 1.8 }}>هاي الخارطة بتعطيك نظرة عامة ممتازة — بس لو بدك خطة مفصّلة أكتر مبنية على وضعك بالضبط، مع:</p>
        <div style={{ textAlign: "right", direction: "rtl", maxWidth: 400, margin: "0 auto 20px", color: B.gL, fontSize: 14, lineHeight: 2 }}>
          <div>✅ مراجعة شخصية لمستواك وأهدافك</div>
          <div>✅ خطة أسبوعية مفصّلة بمواعيد ومهام</div>
          <div>✅ مصادر مختارة تناسب مستواك بالضبط</div>
          <div>✅ مشاريع عملية تبنيها خطوة بخطوة</div>
          <div>✅ متابعة ودعم شخصي من محمد</div>
        </div>
        <a href="https://instagram.com/muhammadbibi.cc" target="_blank" rel="noopener noreferrer" className="btn" style={{ background: `linear-gradient(135deg,${B.or},${B.orD})`, color: B.w, padding: "14px 32px", borderRadius: 99, fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: `0 4px 20px ${B.or}44` }}>📩 تواصل مع محمد عالإنستغرام</a>
        <p style={{ color: B.g, fontSize: 14, marginTop: 16, lineHeight: 1.7 }}>راسلني على <span style={{ color: B.or, fontWeight: 700 }}>@muhammadbibi.cc</span> وقلّي &quot;بدي خطة مخصصة&quot; — وأنا ببنيلك خارطة طريق مفصّلة تمشي عليها بخطواتها</p>
      </div>
    </div>
  );
}
