# 🗺️ IT Roadmap — by Muhammad Bibi

منصة تفاعلية لتوليد خرائط طريق مخصصة لتعلم الـ IT بالعربي.

## 🚀 طريقة النشر على Vercel (٥ دقائق)

### الخطوة ١: ارفع المشروع على GitHub
1. ادخل على [github.com](https://github.com) وسجّل دخول
2. اضغط **New Repository** (أعلى يمين)
3. سمّيه `it-roadmap` واضغط **Create**
4. ارفع كل الملفات من هالمجلد للـ repository

### الخطوة ٢: انشره على Vercel
1. ادخل على [vercel.com](https://vercel.com)
2. سجّل دخول بحساب GitHub
3. اضغط **Add New → Project**
4. اختر `it-roadmap` من القائمة
5. Framework Preset: اختر **Vite**
6. اضغط **Deploy**
7. انتظر دقيقة — وهيك الرابط جاهز! 🎉

### الخطوة ٣: خصص الرابط (اختياري)
- من Settings → Domains → ممكن تضيف دومين مخصص
- أو تغير الـ subdomain لشي مثل `it-roadmap-muhammad.vercel.app`

## 📁 هيكلة المشروع

```
it-roadmap/
├── index.html                  ← الصفحة الرئيسية
├── src/
│   ├── App.jsx                 ← الويزارد + حفظ الخطة والتقدم + المشاركة
│   ├── index.css               ← focus, hover, حركات, وستايل الطباعة
│   ├── theme.js                ← الألوان
│   ├── components/
│   │   ├── Wizard.jsx          ← الأسئلة وشريط الخطوات
│   │   ├── Result.jsx          ← الخطة: الملخص، المراحل، علامات التقدم، دليل الدراسة
│   │   └── Guides.jsx          ← أقسام الـ AI، البومودورو، الإنجليزي، كورسيرا…
│   ├── data/
│   │   ├── roadmaps.json       ← كل محتوى المسارات (المراحل، الأسابيع، المواضيع، المصادر)
│   │   └── options.js          ← خيارات الأسئلة
│   └── lib/
│       ├── plan.js             ← حساب المدة حسب ساعاتك، التقدم، روابط المشاركة
│       ├── plan.test.js        ← اختبارات (node --test)
│       ├── tips.js             ← النصائح المخصصة
│       └── storage.js          ← localStorage آمن
└── tools/
    ├── check_roadmaps.py       ← فاحص محتوى بالبايثون
    └── test_check_roadmaps.py  ← اختبارات الفاحص
```

## 🛠️ للتطوير

```bash
npm install
npm run dev        # تشغيل محلي
npm run build      # بناء للنشر
npm run lint       # ESLint
npm test           # اختبارات منطق الخطة
npm run check      # فحص roadmaps.json بالبايثون  (python3 tools/check_roadmaps.py --summary)
npm run test:py    # اختبارات الفاحص
python3 tools/check_roadmaps.py --links   # فحص كل الروابط (بيحتاج إنترنت)
```

### كيف تضيف أو تعدّل محتوى مسار
كل مسار إله ٣ مستويات بـ `roadmaps.json`: `beginner` (للمبتدئ و"عندي أساسيات" — الأخير بياخد المرحلة الأولى كمراجعة) و `intermediate` و `advanced`.
بآخر كل خطة بتنضاف **مرحلة الهدف** من `goals` (وظيفة / فريلانس / تغيير مجال / تطوير مهارة). مواضيعها فيها `{capstone}` و `{roles}` — الموقع بيعبّيهم من حقول `capstone` (مشروع التخرج) و `roles` (المسميات الوظيفية) بكل مسار بـ `tracks`.
لما الشخص يخلص كل مواضيع خطته، بيطلعله زر ينقله للمستوى اللي بعده.

1. عدّل `src/data/roadmaps.json` — كل مرحلة فيها `title` و `weeks` (رقم، محسوب على ~١٥ ساعة دراسة بالأسبوع) و `items` (٣–٨ مواضيع) و `resources` (اسم + رابط https، والأفضل مصدرين أو أكتر).
2. شغّل `npm run check` — لازم يطلع `0 error(s)`.
3. الموقع بيحسب المدة الحقيقية لكل شخص حسب عدد ساعاته بالأسبوع.

## 💡 ملاحظات
- المنصة بتشتغل بالكامل بدون سيرفر (Static Site)
- ما في أي تكاليف — مجاني ١٠٠٪
- بتستحمل ١٠٠,٠٠٠+ زائر بالشهر على الخطة المجانية
- @muhammadbibi.cc
