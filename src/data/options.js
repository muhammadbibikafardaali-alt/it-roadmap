// Wizard choices. Roadmap content itself lives in roadmaps.json (checked by tools/check_roadmaps.py).
export const LEVELS = [
  { id: "beginner", name: "مبتدئ تماماً", desc: "ما عندي أي خبرة سابقة" },
  { id: "basic", name: "عندي أساسيات", desc: "بعرف شوية أساسيات بس ما تعمقت" },
  { id: "intermediate", name: "متوسط", desc: "عملت مشاريع بسيطة وبدي أتطور" },
  { id: "advanced", name: "متقدم", desc: "عندي خبرة وبدي أتخصص أكتر" },
];
export const HOURS = [
  { id: "5", name: "٥ ساعات بالأسبوع", desc: "حوالي ساعة باليوم بأيام الدوام" },
  { id: "10", name: "١٠ ساعات بالأسبوع", desc: "ساعة ونص تقريباً كل يوم" },
  { id: "20", name: "٢٠ ساعة بالأسبوع", desc: "٣ ساعات تقريباً كل يوم" },
  { id: "40", name: "٤٠+ ساعة بالأسبوع", desc: "متفرغ بالكامل" },
];
export const GOALS = [
  { id: "job", name: "إيجاد وظيفة", icon: "💼" },
  { id: "freelance", name: "عمل حر / فريلانس", icon: "🏠" },
  { id: "skill", name: "تطوير مهاراتي", icon: "📈" },
  { id: "switch", name: "تغيير مجالي", icon: "🔄" },
];
export const OBSTACLES = [
  { id: "sources", name: "كثرة المصادر وما بعرف من وين أبدأ", icon: "📚" },
  { id: "branch", name: "ما بعرف شو الفرع المناسب لي", icon: "🤷" },
  { id: "motivation", name: "ببدأ بحماس وبوقف بعد فترة", icon: "😔" },
  { id: "noplan", name: "ما عندي خطة واضحة أمشي عليها", icon: "🗺️" },
];
export const DEVICES = [
  { id: "pc", name: "عندي كومبيوتر (لابتوب أو ديسكتوب)", icon: "💻", desc: "جاهز للتطبيق العملي الكامل" },
  { id: "mobile", name: "عندي موبايل بس", icon: "📱", desc: "ممكن تتعلم نظري بس بتحتاج كومبيوتر للتطبيق" },
  { id: "both", name: "عندي الاثنين", icon: "🖥️", desc: "ممتاز — بتقدر تتعلم بأي وقت" },
];
