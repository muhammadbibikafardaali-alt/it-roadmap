import { B, card } from "../theme.js";

export function AISection() {
  const practices = [
    { t: "حاول قبل ما تسأل", d: "جرّب حل المشكلة بنفسك أولاً، بعدين اطلب من الـ AI يساعدك تفهم وين أخطأت." },
    { t: "كن محدداً بسؤالك", d: "بدل \"اشرح البرمجة\" قل \"اشرح كيف يعمل for loop في Python بمثال بسيط لمبتدئ\"." },
    { t: "لخّص بكلامك بعد الشرح", d: "اكتب ملخصك وقل للـ AI \"هل فهمت صح؟\" — هاد بيكشف ثغرات الفهم فوراً." },
    { t: "استخدمه كمختبر", d: "قل له \"اسألني ٥ أسئلة صعبة وصحح إجاباتي\". الاختبار الذاتي بيثبّت المعلومة." },
    { t: "اطلب خطة تعلّم", d: "قل \"عندي ساعة يومياً وأريد أتعلم [الموضوع] في شهر — رتّب لي خطوات واضحة\"." },
    { t: "اربط المفاهيم ببعض", d: "قل \"كيف يرتبط هذا بما تعلمته عن [الموضوع السابق]؟\" — بيبني فهم عميق." },
  ];
  const warnings = ["لا تنسخ الكود بدون فهمه", "لا تصدّق كل شي بدون تحقق", "لا تسأله عن كود بدون مراجعة النتيجة", "لا تعتمد عليه بدل التطبيق الفعلي"];
  const techs = [
    { n: "تقنية Feynman", d: "اطلب من الـ AI يشرح المفهوم كأنك طفل ١٠ سنوات — أبسط تفسير = أعمق فهم" },
    { n: "Active Recall", d: "اكتب كل ما تعرفه عن الموضوع أولاً، ثم اسأل الـ AI يكمّل ما ينقص — بيقوّي الذاكرة" },
    { n: "Spaced Repetition", d: "كل أسبوع قل للـ AI \"راجع معي مفاهيم الأسبوع الماضي بأسئلة سريعة\" لتثبيت التعلم" },
  ];
  return (
    <div style={card()}>
      <div style={{ background: `linear-gradient(135deg,${B.bl},${B.blD})`, padding: "20px 24px", borderBottom: `2px solid ${B.or}33` }}>
        <h2 style={{ color: B.w, fontSize: 22, fontWeight: 800, margin: 0 }}>🤖 كيف تخلّي الـ AI صديقك بالتعلم</h2>
        <p style={{ color: B.g, fontSize: 14, marginTop: 8, lineHeight: 1.7 }}>الذكاء الاصطناعي مو بديل عن التفكير — هو مساعد يسرّع رحلتك. استخدمه بذكاء!</p>
      </div>
      <div style={{ padding: "20px 24px" }}>
        <h3 style={{ color: B.ok, fontSize: 18, fontWeight: 700, marginBottom: 14 }}>✅ أفضل الممارسات</h3>
        {practices.map((p, i) => (<div key={i} style={{ background: `${B.ok}11`, borderRadius: 12, padding: "12px 16px", marginBottom: 8, borderRight: `3px solid ${B.ok}` }}><div style={{ color: B.w, fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{p.t}</div><div style={{ color: B.g, fontSize: 13, lineHeight: 1.7 }}>{p.d}</div></div>))}
        <h3 style={{ color: B.warn, fontSize: 18, fontWeight: 700, marginBottom: 14, marginTop: 20 }}>⚠️ تحذيرات مهمة</h3>
        {warnings.map((w, i) => (<div key={i} style={{ background: `${B.warn}11`, borderRadius: 12, padding: "12px 16px", marginBottom: 8, borderRight: `3px solid ${B.warn}`, color: B.w, fontSize: 14 }}>❌ {w}</div>))}
        <h3 style={{ color: B.or, fontSize: 18, fontWeight: 700, marginBottom: 14, marginTop: 20 }}>🧠 تقنيات تعلّم ذكية</h3>
        {techs.map((t, i) => (<div key={i} style={{ background: `${B.or}11`, borderRadius: 12, padding: "14px 18px", marginBottom: 8, border: `1px solid ${B.or}22` }}><div style={{ color: B.or, fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{t.n}</div><div style={{ color: B.gL, fontSize: 13, lineHeight: 1.7 }}>{t.d}</div></div>))}
        <div style={{ background: `linear-gradient(135deg,${B.or}15,${B.warn}10)`, borderRadius: 16, padding: "20px 24px", border: `2px solid ${B.or}33`, textAlign: "center", marginTop: 16 }}>
          <h3 style={{ color: B.or, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>💡 القاعدة الذهبية</h3>
          <p style={{ color: B.gL, fontSize: 15, lineHeight: 1.8, margin: 0 }}>الـ AI هو مساعد وليس بديلاً عن التفكير. استخدمه لتفهم أعمق — لا لتتجنب التفكير. العقل الذي يتمرّن هو العقل الذي ينمو.</p>
        </div>
      </div>
    </div>
  );
}

export function CommitSection() {
  const tips = [
    { i: "📅", t: "حدد وقت ثابت يومياً للدراسة — حتى لو نص ساعة. الثبات أهم من الكمية." },
    { i: "📊", t: "تتبّع تقدمك — سجّل كل يوم شو تعلمت. بيحفزك لما تشوف كم قطعت." },
    { i: "🎯", t: "ركّز على مرحلة وحدة. ما تحاول تتعلم كل شي مع بعض." },
    { i: "💪", t: "لما تحس بالإحباط — هاد طبيعي ١٠٠٪. كل محترف مر بنفس الشعور." },
    { i: "🤝", t: "ابحث عن Study buddy — الرحلة مع شخص أسهل وأمتع." },
    { i: "🔄", t: "لا تخاف ترجع تراجع — التكرار مو ضعف، التكرار هو طريقة الدماغ يتعلم." },
  ];
  return (
    <div style={card()}>
      <div style={{ background: `linear-gradient(135deg,${B.ok}22,${B.card})`, padding: "20px 24px", borderBottom: `2px solid ${B.ok}33` }}>
        <h2 style={{ color: B.w, fontSize: 22, fontWeight: 800, margin: 0 }}>🎯 الالتزام بالخطة — مفتاح النجاح</h2>
        <p style={{ color: B.g, fontSize: 14, marginTop: 8, lineHeight: 1.7 }}>هاي الخطة ما رح تنفعك إذا ما التزمت فيها. الفرق بين اللي بينجح واللي لأ هو الاستمرارية، مو الموهبة.</p>
      </div>
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        {tips.map((tip, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, background: `${B.ok}08`, borderRadius: 12, padding: "12px 16px" }}><span style={{ fontSize: 24, flexShrink: 0 }}>{tip.i}</span><p style={{ color: B.gL, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{tip.t}</p></div>))}
      </div>
    </div>
  );
}

export function EnglishSection() {
  const tips = ["ابدأ بفيديوهات تقنية مع subtitles إنجليزية", "اكتب ملاحظاتك بالإنجليزي حتى لو غلط", "استخدم الـ AI ليترجم المصطلحات التقنية ويشرحها", "اقرأ Documentation بالإنجليزي — أهم مهارة رح تتعلمها", "تابع محتوى إنجليزي يومياً حتى لو ١٠ دقائق"];
  return (
    <div style={card()}>
      <div style={{ background: `linear-gradient(135deg,#3B82F622,${B.card})`, padding: "20px 24px", borderBottom: "2px solid #3B82F633" }}>
        <h2 style={{ color: B.w, fontSize: 22, fontWeight: 800, margin: 0 }}>🌍 الإنجليزي — ما تخاف منه!</h2>
        <p style={{ color: B.g, fontSize: 14, marginTop: 8, lineHeight: 1.7 }}>معظم المصادر القوية بالـ IT بالإنجليزي. ممكن يكون صعب بالبداية، بس بعد شهر من الممارسة رح تلاحظ فرق كبير. ابدأ بفيديوهات مع ترجمة وشوي شوي شيلها.</p>
      </div>
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
        {tips.map((t, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, color: B.gL, fontSize: 14, lineHeight: 1.6 }}><span style={{ color: "#3B82F6", marginTop: 2, flexShrink: 0 }}>▸</span>{t}</div>))}
      </div>
    </div>
  );
}

export function CourseraSection() {
  const steps = ["ادخل على coursera.org وسجّل حساب", "اختر الكورس اللي بدك إياه", "اضغط على \"Financial Aid\" تحت زر التسجيل", "اكتب سبب طلبك بصدق (ما بتحتاج تكون طويلة)", "انتظر ١-٢ أسبوع — وعادةً بتنقبل!"];
  return (
    <div style={card()}>
      <div style={{ background: `linear-gradient(135deg,#8B5CF622,${B.card})`, padding: "20px 24px", borderBottom: "2px solid #8B5CF633" }}>
        <h2 style={{ color: B.w, fontSize: 22, fontWeight: 800, margin: 0 }}>🎓 كورسيرا — كورسات عالمية بمنح مجانية!</h2>
        <p style={{ color: B.g, fontSize: 14, marginTop: 8, lineHeight: 1.7 }}>منصة Coursera فيها كورسات من أفضل جامعات العالم. والأهم — بتعطي منح مجانية (Financial Aid). إذا وضعك المادي ما بيسمح، قدّم على المنحة وغالباً بتنقبل!</p>
      </div>
      <div style={{ padding: "20px 24px" }}>
        <h3 style={{ color: "#8B5CF6", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>خطوات التقديم على المنحة:</h3>
        {steps.map((st, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}><div style={{ width: 28, height: 28, borderRadius: 99, background: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 800, color: B.w }}>{i + 1}</div><p style={{ color: B.gL, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{st}</p></div>))}
      </div>
    </div>
  );
}

export function PomodoroSection() {
  return (
    <div style={card()}>
      <div style={{ background: `linear-gradient(135deg,#EF444422,${B.card})`, padding: "20px 24px", borderBottom: "2px solid #EF444433" }}>
        <h2 style={{ color: B.w, fontSize: 22, fontWeight: 800, margin: 0 }}>⏱️ تنظيم الوقت — تقنية البومودورو</h2>
        <p style={{ color: B.g, fontSize: 14, marginTop: 8, lineHeight: 1.7 }}>واحدة من أفضل الطرق للدراسة الفعّالة. الفكرة بسيطة: ادرس ٢٥ دقيقة بتركيز كامل، بعدين خذ استراحة ٥ دقائق. بعد ٤ جلسات، خذ استراحة طويلة ١٥-٣٠ دقيقة.</p>
      </div>
      <div style={{ padding: "20px 24px" }}>
        <div className="pomo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
          {[{ n: "١", t: "ادرس", d: "٢٥ دقيقة", c: "#EF4444" }, { n: "٢", t: "استرح", d: "٥ دقائق", c: B.ok }, { n: "٣", t: "كرر", d: "٤ مرات", c: B.or }, { n: "٤", t: "استرح", d: "١٥-٣٠ د", c: "#8B5CF6" }].map((s, i) => (
            <div key={i} style={{ background: `${s.c}15`, borderRadius: 12, padding: "14px 8px", textAlign: "center", border: `1px solid ${s.c}33` }}>
              <div style={{ width: 28, height: 28, borderRadius: 99, background: s.c, margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: B.w }}>{s.n}</div>
              <div style={{ color: B.w, fontSize: 14, fontWeight: 600 }}>{s.t}</div>
              <div style={{ color: B.gD, fontSize: 12, marginTop: 2 }}>{s.d}</div>
            </div>
          ))}
        </div>
        <h3 style={{ color: "#EF4444", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🛠️ أدوات ومصادر تساعدك:</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { name: "🎥 شرح تقنية البومودورو — كيف تدرس بذكاء", url: "https://youtu.be/mNBmG24djoY" },
            { name: "Pomofocus — تايمر بومودورو مجاني أونلاين", url: "https://pomofocus.io" },
            { name: "Forest App — تطبيق تركيز بيزرع أشجار!", url: "https://forestapp.cc" },
            { name: "🎥 كيف تنظم وقتك كطالب IT", url: "https://youtu.be/iONDebHX9qk" },
            { name: "Notion — لتنظيم ملاحظاتك ومهامك (مجاني)", url: "https://notion.so" },
            { name: "Google Calendar — جدول دراستك الأسبوعي", url: "https://calendar.google.com" },
          ].map((r, i) => (<a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{ background: "#EF444412", color: "#FB7185", fontSize: 13, padding: "8px 14px", borderRadius: 12, fontWeight: 500, textDecoration: "none", display: "block" }}>📚 {r.name}</a>))}
        </div>
        <div style={{ background: `${B.or}11`, borderRadius: 12, padding: "14px 18px", marginTop: 16, border: `1px solid ${B.or}22` }}>
          <div style={{ color: B.or, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>💡 نصيحة ذهبية</div>
          <div style={{ color: B.gL, fontSize: 13, lineHeight: 1.7 }}>ابدأ بجلسة بومودورو وحدة باليوم — ٢٥ دقيقة بس. بعد أسبوع زِد لجلستين. الأهم إنك تبدأ، مو إنك تدرس ساعات طويلة من أول يوم.</div>
        </div>
      </div>
    </div>
  );
}

export function DeviceNote({ device }) {
  if (device !== "mobile") return null;
  return (
    <div style={card({ border: `1px solid ${B.warn}33` })}>
      <div style={{ padding: "20px 24px" }}>
        <h3 style={{ color: B.warn, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>📱 ملاحظة مهمة — أنت عندك موبايل بس</h3>
        <p style={{ color: B.gL, fontSize: 14, lineHeight: 1.8, margin: 0 }}>
          الموبايل ممكن يساعدك تتعلم كتير أشياء نظرية — مثل مشاهدة الفيديوهات، قراءة المقالات، حل كويزات، وحتى تعلم أساسيات البرمجة عبر تطبيقات مثل SoloLearn و Grasshopper.
          <br /><br />
          بس لتطبّق بإيدك فعلياً — تكتب كود، تبني مشاريع، تستخدم أدوات حقيقية — <span style={{ color: B.warn, fontWeight: 700 }}>بتحتاج كومبيوتر</span>. حتى لابتوب بسيط ومستعمل بيكفي للبداية.
          <br /><br />
          ابدأ بالجانب النظري عالموبايل، وخطط تحصل على كومبيوتر بأقرب وقت عشان تدخل مرحلة التطبيق العملي.
        </p>
      </div>
    </div>
  );
}

export function ObstacleNote({ obstacle }) {
  const notes = {
    sources: { icon: "📚", title: "كثرة المصادر؟ هاي الخطة هي الحل!", msg: "هاي الخارطة بتحدد لك بالضبط شو تتعلم ومن وين، خطوة بخطوة. لا تفتح يوتيوب عشوائي — التزم بالمصادر المذكورة بكل مرحلة وما تنتقل للمرحلة التالية إلا لما تخلص الأولى." },
    branch: { icon: "🤷", title: "ما بتعرف الفرع المناسب؟", msg: "ما في فرع \"غلط\" — كلهم فيهم فرص عمل. المهم تبدأ! جرّب المسار اللي اخترته لمدة شهر. إذا ما حبيته، غيّره. التجربة أفضل ألف مرة من التفكير بدون عمل." },
    motivation: { icon: "😔", title: "بتبدأ بحماس وبتوقف؟", msg: "هاد أشهر مشكلة! الحل: لا تعتمد على الحماس — اعتمد على العادات. حط وقت ثابت يومي حتى لو ٢٠ دقيقة. بعد ٣ أسابيع بيصير عادة أوتوماتيكية. واستخدم تقنية البومودورو اللي تحت." },
    noplan: { icon: "🗺️", title: "ما عندك خطة؟ هلق صار عندك!", msg: "هاي خارطة طريقك المخصصة بناءً على إجاباتك. كل مرحلة محددة بوقت ومصادر ومشاريع. التزم فيها وما تبحث عن خطط ثانية — التشتت هو عدو التقدم." },
  };
  const note = notes[obstacle];
  if (!note) return null;
  return (
    <div style={card({ border: `1px solid ${B.or}44` })}>
      <div style={{ padding: "20px 24px" }}>
        <h3 style={{ color: B.or, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{note.icon} {note.title}</h3>
        <p style={{ color: B.gL, fontSize: 14, lineHeight: 1.8, margin: 0 }}>{note.msg}</p>
      </div>
    </div>
  );
}
