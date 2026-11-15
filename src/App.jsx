import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { B } from "./theme.js";
import { STEPS, StepBar } from "./components/Wizard.jsx";
import { Result } from "./components/Result.jsx";
import { generateSmartTips } from "./lib/tips.js";
import { answersFromQuery, answersToQuery, isComplete } from "./lib/plan.js";
import { load, remove, save } from "./lib/storage.js";

const KEY_PLAN = "itr:plan"; // { answers, startDate }
const KEY_PROGRESS = "itr:progress"; // { "<track>:<path>:<phase>:<item>": true }
const AUTO_ADVANCE_MS = 280;

// Decorative floating dots. Positions are random but fixed for the session
// (they used to be re-randomised on every keystroke).
function Particles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        size: Math.random() * 4 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.3 + 0.1,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
        color: i % 3 === 0 ? B.or : B.blL,
      })),
    [],
  );
  return (
    <div aria-hidden="true" className="particles" style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {dots.map((d, i) => (
        <div key={i} style={{ position: "absolute", borderRadius: "50%", width: d.size, height: d.size, left: `${d.left}%`, top: `${d.top}%`, background: d.color, opacity: d.opacity, animation: `floatDot ${d.duration}s ease-in-out ${d.delay}s infinite` }} />
      ))}
    </div>
  );
}

// Initial state: a shared link (?t=..&l=..&h=..) wins, then a saved plan, then an empty wizard.
function initialState() {
  const fromUrl = typeof window !== "undefined" ? answersFromQuery(window.location.search) : null;
  if (fromUrl) return { answers: fromUrl, done: true, startDate: new Date().toISOString(), shared: true };
  const saved = load(KEY_PLAN, null);
  if (saved?.answers && isComplete(saved.answers)) return { answers: saved.answers, done: true, startDate: saved.startDate, shared: false };
  return { answers: {}, done: false, startDate: null, shared: false };
}

export default function App() {
  const init = useMemo(initialState, []);
  const [step, setStep] = useState(0);
  const [a, setA] = useState(init.answers);
  const [done, setDone] = useState(init.done);
  const [startDate, setStartDate] = useState(init.startDate);
  // Opened from someone else's link: show it, but don't overwrite this device's own plan.
  const [shared, setShared] = useState(init.shared);
  const [progress, setProgress] = useState(() => load(KEY_PROGRESS, {}));
  const [toast, setToast] = useState("");
  const advanceTimer = useRef(null);
  const toastTimer = useRef(null);

  const total = STEPS.length;
  const current = STEPS[step];
  const canNext = !current.field || !!a[current.field];
  const tips = useMemo(() => (done ? generateSmartTips(a) : []), [done, a]);

  // Remember the plan and progress on this device.
  useEffect(() => {
    if (done && !shared && isComplete(a)) save(KEY_PLAN, { answers: a, startDate });
  }, [done, shared, a, startDate]);
  useEffect(() => save(KEY_PROGRESS, progress), [progress]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, done]);

  useEffect(() => () => {
    clearTimeout(advanceTimer.current);
    clearTimeout(toastTimer.current);
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  }, []);

  const finish = () => {
    setStartDate((d) => d ?? new Date().toISOString());
    setDone(true);
  };
  const next = () => {
    clearTimeout(advanceTimer.current);
    if (!canNext) return;
    if (step < total - 1) setStep(step + 1);
    else finish();
  };
  const back = () => {
    clearTimeout(advanceTimer.current);
    if (step > 0) setStep(step - 1);
  };
  const goTo = (i) => {
    clearTimeout(advanceTimer.current);
    setStep(i);
  };

  // Picking an answer moves on automatically after a short pause.
  const pick = (field, value) => {
    setA((prev) => ({ ...prev, [field]: value }));
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => setStep((s) => Math.min(s + 1, total - 1)), AUTO_ADVANCE_MS);
  };

  const clearUrl = () => {
    if (window.location.search) window.history.replaceState(null, "", window.location.pathname);
  };
  const adopt = () => {
    clearUrl();
    setShared(false);
    setStartDate(new Date().toISOString());
    showToast("✅ صارت هاي خطتك — محفوظة على هالجهاز");
  };
  const edit = () => {
    clearUrl();
    setShared(false);
    setDone(false);
    setStep(0);
  };
  const restart = () => {
    if (!window.confirm("متأكد؟ رح تنمسح إجاباتك (تقدمك بالمواضيع بيضل محفوظ).")) return;
    clearUrl();
    setShared(false);
    remove(KEY_PLAN);
    setA({});
    setStartDate(null);
    setDone(false);
    setStep(0);
  };
  const toggle = (key) =>
    setProgress((p) => {
      const n = { ...p };
      if (n[key]) delete n[key];
      else n[key] = true;
      return n;
    });

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}?${answersToQuery(a)}`;
    const data = { title: "خارطة طريقي في الـ IT", text: "هاي خطتي لتعلم الـ IT — اعمل خطتك:", url };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      showToast("✅ تم نسخ رابط الخطة");
    } catch (err) {
      if (err?.name === "AbortError") return; // user closed the share sheet
      window.prompt("انسخ الرابط:", url);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && e.target.getAttribute("role") !== "radio" && e.target.tagName !== "BUTTON") next();
  };

  return (
    <div className="app-shell" style={{ minHeight: "100vh", background: `linear-gradient(180deg,${B.bg} 0%,${B.blD} 100%)`, position: "relative" }}>
      <Particles />
      <main style={{ position: "relative", zIndex: 1, padding: "20px 16px 48px", maxWidth: 900, margin: "0 auto" }} onKeyDown={onKeyDown}>
        <header style={{ textAlign: "center", marginBottom: 28, paddingTop: 12 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: B.card, padding: "10px 24px", borderRadius: 99, border: `1px solid ${B.blL}` }}>
            <span aria-hidden="true" style={{ fontSize: 24 }}>🗺️</span>
            <span style={{ color: B.w, fontSize: 18, fontWeight: 700 }}>IT Roadmap</span>
            <span style={{ color: B.or, fontSize: 14 }}>by Muhammad</span>
          </div>
        </header>

        {!done ? (
          <>
            <StepBar step={step} total={total} a={a} goTo={goTo} />
            <div key={step} className="step-in" style={{ background: `${B.card}CC`, borderRadius: 24, padding: "28px 20px", border: `1px solid ${B.blL}`, backdropFilter: "blur(20px)", marginBottom: 20 }}>
              {current.render({ a, setA, pick })}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, direction: "rtl" }}>
              {step > 0 && (
                <button type="button" className="btn" onClick={back} style={{ background: B.blL, color: B.w, border: "none", padding: "14px 28px", borderRadius: 99, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                  → رجوع
                </button>
              )}
              <button type="button" className="btn" onClick={next} disabled={!canNext} style={{ background: canNext ? `linear-gradient(135deg,${B.or},${B.orD})` : B.blL, color: B.w, border: "none", padding: "14px 36px", borderRadius: 99, fontSize: 16, fontWeight: 700, cursor: canNext ? "pointer" : "not-allowed", opacity: canNext ? 1 : 0.5, boxShadow: canNext ? `0 4px 20px ${B.or}44` : "none" }}>
                {step === total - 1 ? "🚀 أنشئ خارطة الطريق" : "التالي ←"}
              </button>
            </div>
            {!canNext && <p style={{ color: B.gD, fontSize: 13, textAlign: "center", marginTop: 12 }}>اختر جواب لتكمل</p>}
          </>
        ) : (
          <>
            {shared && (
              <div className="no-print step-in" style={{ maxWidth: 820, margin: "0 auto 16px", background: B.card, border: `1px solid ${B.or}66`, borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", direction: "rtl" }}>
                <span style={{ color: B.gL, fontSize: 14 }}>👀 هاي خطة حدا شاركها معك. بدك تمشي عليها؟</span>
                <span style={{ display: "flex", gap: 8 }}>
                  <button type="button" className="btn" onClick={adopt} style={{ background: B.or, color: B.w, border: "none", padding: "9px 16px", borderRadius: 99, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>اعتمدها كخطتي</button>
                  <button type="button" className="btn" onClick={edit} style={{ background: B.blL, color: B.w, border: "none", padding: "9px 16px", borderRadius: 99, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>اعمل خطتي</button>
                </span>
              </div>
            )}
            <Result a={a} tips={tips} done={progress} toggle={toggle} startDate={startDate} onShare={share} onPrint={() => window.print()} onEdit={edit} onRestart={restart} />
          </>
        )}
      </main>
      {toast && <div role="status" className="toast no-print">{toast}</div>}
    </div>
  );
}
