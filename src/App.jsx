import { useState } from "react";

const B = { or: "#F97316", orL: "#FB923C", orD: "#EA580C", bl: "#1E293B", blD: "#0F172A", blL: "#334155", w: "#FFF", g: "#94A3B8", gL: "#E2E8F0", gD: "#64748B", bg: "#0B1120", card: "#131C31", ok: "#22C55E", warn: "#EAB308" };

const TRACKS = [
  { id: "frontend", name: "تطوير الواجهات الأمامية", icon: "🌐", desc: "HTML, CSS, JavaScript, React" },
  { id: "backend", name: "تطوير الخوادم", icon: "⚙️", desc: "Node.js, Python, APIs, Databases" },
  { id: "fullstack", name: "مطور Full Stack", icon: "🚀", desc: "Frontend + Backend معاً" },
  { id: "cyber", name: "الأمن السيبراني", icon: "🔒", desc: "Ethical Hacking, Security, Networks" },
  { id: "data", name: "علم البيانات", icon: "📊", desc: "Python, ML, AI, Analytics" },
  { id: "mobile", name: "تطوير تطبيقات الموبايل", icon: "📱", desc: "Flutter, React Native, Swift" },
  { id: "devops", name: "DevOps", icon: "🔄", desc: "Docker, CI/CD, Cloud, Linux" },
  { id: "network", name: "إدارة الشبكات", icon: "🌍", desc: "CCNA, Network+, Infrastructure" },
];
const LEVELS = [
  { id: "beginner", name: "مبتدئ تماماً", desc: "ما عندي أي خبرة سابقة" },
  { id: "basic", name: "عندي أساسيات", desc: "بعرف شوية أساسيات بس ما تعمقت" },
  { id: "intermediate", name: "متوسط", desc: "عملت مشاريع بسيطة وبدي أتطور" },
  { id: "advanced", name: "متقدم", desc: "عندي خبرة وبدي أتخصص أكتر" },
];
const HOURS = [
  { id: "5", name: "٥ ساعات بالأسبوع", desc: "وقت محدود" },
  { id: "10", name: "١٠ ساعات بالأسبوع", desc: "وقت معقول" },
  { id: "20", name: "٢٠ ساعات بالأسبوع", desc: "وقت جيد للتعلم" },
  { id: "40", name: "٤٠+ ساعات بالأسبوع", desc: "متفرغ بالكامل" },
];
const GOALS = [
  { id: "job", name: "إيجاد وظيفة", icon: "💼" },
  { id: "freelance", name: "عمل حر / فريلانس", icon: "🏠" },
  { id: "skill", name: "تطوير مهاراتي", icon: "📈" },
  { id: "switch", name: "تغيير مجالي", icon: "🔄" },
];

const R = (name, url) => ({ name, url });
const T = {
  frontend: {
    beginner: [
      { phase: 1, title: "أساسيات الويب", duration: "٤ أسابيع", items: ["HTML5 — هيكلة صفحات الويب", "CSS3 — تنسيق وتصميم", "أساسيات JavaScript", "مشروع: صفحة شخصية بسيطة"], resources: [R("freeCodeCamp (مجاني)", "https://freecodecamp.org"), R("W3Schools", "https://w3schools.com"), R("MDN Web Docs", "https://developer.mozilla.org/ar/")] },
      { phase: 2, title: "JavaScript متقدم", duration: "٦ أسابيع", items: ["DOM Manipulation", "ES6+ Features", "Async/Await & Promises", "مشروع: تطبيق قائمة مهام"], resources: [R("JavaScript.info", "https://javascript.info"), R("Eloquent JavaScript (كتاب مجاني)", "https://eloquentjavascript.net"), R("🎥 Mosh — JavaScript for Beginners", "https://youtube.com/@programmingwithmosh"), R("Coursera — منح مجانية متاحة!", "https://coursera.org")] },
      { phase: 3, title: "إطار عمل React", duration: "٨ أسابيع", items: ["React Fundamentals", "Hooks & State Management", "React Router", "مشروع: تطبيق متجر إلكتروني"], resources: [R("React Docs الرسمي", "https://react.dev"), R("🎥 Mosh — React Tutorial", "https://youtube.com/@programmingwithmosh"), R("Scrimba React Course", "https://scrimba.com")] },
      { phase: 4, title: "أدوات احترافية", duration: "٤ أسابيع", items: ["Git & GitHub", "Tailwind CSS", "Testing Basics", "بناء Portfolio احترافي"], resources: [R("GitHub Learning Lab", "https://github.com"), R("Tailwind Docs", "https://tailwindcss.com")] },
    ],
    intermediate: [
      { phase: 1, title: "React متقدم", duration: "٦ أسابيع", items: ["Context API & Redux", "Performance Optimization", "Custom Hooks", "مشروع: Dashboard تفاعلي"], resources: [R("Epic React", "https://epicreact.dev"), R("Coursera — منح مجانية!", "https://coursera.org")] },
      { phase: 2, title: "TypeScript", duration: "٤ أسابيع", items: ["TypeScript Basics", "Types & Interfaces", "Generics", "React + TypeScript"], resources: [R("TypeScript Handbook", "https://typescriptlang.org/docs")] },
      { phase: 3, title: "Next.js & SSR", duration: "٦ أسابيع", items: ["Next.js Fundamentals", "Server Components", "API Routes", "مشروع: مدونة كاملة"], resources: [R("Next.js Docs", "https://nextjs.org/docs")] },
      { phase: 4, title: "تحضير للسوق", duration: "٤ أسابيع", items: ["System Design Basics", "Interview Preparation", "Portfolio Projects", "LinkedIn & CV Optimization"], resources: [R("Frontend Masters", "https://frontendmasters.com"), R("LeetCode", "https://leetcode.com")] },
    ],
  },
  cyber: {
    beginner: [
      { phase: 0, title: "🐧 تجهيز بيئة العمل — Linux", duration: "أسبوعين", items: ["نزّل Linux (Ubuntu أو Kali) على VM أو كلاود مجاني", "تعلّم أساسيات سطر الأوامر (Terminal)", "إدارة الملفات والمجلدات بـ Linux", "تعلّم الصلاحيات والمستخدمين"], resources: [R("🎥 شرح تنزيل واستخدام Linux", "https://youtu.be/sWbUDq4S6Y8"), R("TryHackMe — Linux Fundamentals", "https://tryhackme.com"), R("OverTheWire Bandit (تعلم بالممارسة)", "https://overthewire.org/wargames/bandit/")] },
      { phase: 1, title: "أساسيات الشبكات والأمان", duration: "٤ أسابيع", items: ["TCP/IP Model & OSI Layers", "Network Protocols (HTTP, DNS, DHCP)", "أساسيات التشفير (Cryptography)", "مختبر: تحليل ترافيك بـ Wireshark"], resources: [R("🎥 NetworkChuck — دورات السايبر", "https://youtube.com/@networkchuck"), R("🎥 دورة أساسيات السايبر (عربي)", "https://youtube.com/playlist?list=PLh2Jy0nKL_j1WZMzITHgUuzaadpSULlMm"), R("Professor Messer (مجاني)", "https://professormesser.com"), R("Cisco Networking Academy", "https://skillsforall.com")] },
      { phase: 2, title: "🐍 البايثون للسايبر", duration: "٦ أسابيع", items: ["أساسيات Python", "التعامل مع الملفات والشبكات", "كتابة أدوات بسيطة للأمان", "مشروع: Port Scanner بالبايثون"], resources: [R("🎥 بايثون بالعربي — الزيرو ويب سكول", "https://youtube.com/playlist?list=PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs"), R("🎥 Harvard CS50 Python (مجاني)", "https://youtu.be/nLRL_NcnK-4"), R("🎥 بايثون للمبتدئين — freeCodeCamp", "https://youtu.be/WiYuS9ft78I"), R("Coursera Python — منح مجانية متاحة!", "https://coursera.org")] },
      { phase: 3, title: "الاختراق الأخلاقي", duration: "٨ أسابيع", items: ["Kali Linux Tools", "Reconnaissance & Scanning", "Web App Security (OWASP Top 10)", "مختبر: حل تحديات على TryHackMe"], resources: [R("TryHackMe (مجاني للبداية)", "https://tryhackme.com"), R("Hack The Box", "https://hackthebox.com"), R("PortSwigger Academy (مجاني)", "https://portswigger.net/web-security"), R("Coursera Cybersecurity — منح مجانية!", "https://coursera.org")] },
      { phase: 4, title: "شهادات وتحضير للسوق", duration: "٦ أسابيع", items: ["CompTIA Security+ تحضير", "CEH Preparation", "Bug Bounty — اكتشف ثغرات واربح مال", "بناء Lab شخصي + Portfolio أمني"], resources: [R("CompTIA Resources", "https://comptia.org"), R("HackerOne — Bug Bounty", "https://hackerone.com"), R("Coursera شهادات — منح مجانية!", "https://coursera.org")] },
    ],
    intermediate: [
      { phase: 1, title: "اختبار الاختراق المتقدم", duration: "٦ أسابيع", items: ["Advanced Exploitation", "Privilege Escalation", "Active Directory Attacks", "مختبر: HTB Pro Labs"], resources: [R("Hack The Box Pro Labs", "https://hackthebox.com"), R("🎥 NetworkChuck Advanced", "https://youtube.com/@networkchuck")] },
      { phase: 2, title: "أمن الشبكات والمراقبة", duration: "٤ أسابيع", items: ["Firewall & IDS/IPS", "SIEM Tools (Splunk, ELK)", "Threat Hunting", "مختبر: تحليل هجوم حقيقي"], resources: [R("Splunk Free Training", "https://splunk.com"), R("Wireshark Docs", "https://wireshark.org")] },
      { phase: 3, title: "أمن التطبيقات والكلاود", duration: "٦ أسابيع", items: ["Secure Coding", "API Security Testing", "Cloud Security (AWS/Azure)", "مختبر: اكتشاف ثغرات حقيقية"], resources: [R("PortSwigger Academy", "https://portswigger.net/web-security"), R("AWS Security Training", "https://aws.amazon.com/training/")] },
      { phase: 4, title: "شهادات متقدمة", duration: "٨ أسابيع", items: ["OSCP Preparation", "Cloud Security Certs", "Incident Response", "بناء Portfolio أمني"], resources: [R("Offensive Security (OSCP)", "https://offensive-security.com"), R("Coursera Advanced — منح مجانية!", "https://coursera.org")] },
    ],
  },
  backend: {
    beginner: [
      { phase: 1, title: "🐍 أساسيات البايثون", duration: "٥ أسابيع", items: ["المتغيرات والشروط والحلقات", "الدوال والـ OOP", "التعامل مع الملفات", "مشروع: برنامج إدارة مهام"], resources: [R("🎥 بايثون بالعربي — الزيرو", "https://youtube.com/playlist?list=PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs"), R("🎥 Mosh — Python Tutorial", "https://youtube.com/@programmingwithmosh"), R("🎥 Harvard CS50 Python", "https://youtu.be/nLRL_NcnK-4"), R("Coursera — منح مجانية!", "https://coursera.org")] },
      { phase: 2, title: "قواعد البيانات", duration: "٤ أسابيع", items: ["SQL Fundamentals", "PostgreSQL / MySQL", "Database Design", "مشروع: قاعدة بيانات لمتجر"], resources: [R("SQLBolt (مجاني)", "https://sqlbolt.com"), R("freeCodeCamp SQL", "https://freecodecamp.org")] },
      { phase: 3, title: "بناء APIs", duration: "٦ أسابيع", items: ["REST API Concepts", "Flask / Django / Express", "Authentication & JWT", "مشروع: API لتطبيق مدونة"], resources: [R("Django Docs", "https://djangoproject.com"), R("Express.js Guide", "https://expressjs.com")] },
      { phase: 4, title: "النشر والأدوات", duration: "٤ أسابيع", items: ["Git & GitHub", "Docker Basics", "Cloud Deployment", "بناء مشروع Backend كامل"], resources: [R("Docker Getting Started", "https://docker.com/get-started"), R("Railway.app (مجاني)", "https://railway.app")] },
    ],
    intermediate: [
      { phase: 1, title: "Backend متقدم", duration: "٦ أسابيع", items: ["Microservices", "Message Queues (Redis, RabbitMQ)", "MongoDB & Redis", "مشروع: نظام e-commerce"], resources: [R("System Design Primer", "https://github.com/donnemartin/system-design-primer")] },
      { phase: 2, title: "DevOps Basics", duration: "٤ أسابيع", items: ["CI/CD Pipelines", "Docker Compose", "Nginx & Load Balancing", "مشروع: Pipeline كامل"], resources: [R("GitHub Actions", "https://docs.github.com/en/actions")] },
      { phase: 3, title: "Cloud & Scaling", duration: "٦ أسابيع", items: ["AWS / GCP Fundamentals", "Serverless Functions", "Caching Strategies", "مشروع: Scalable App"], resources: [R("AWS Free Tier", "https://aws.amazon.com/free/")] },
      { phase: 4, title: "تحضير للسوق", duration: "٤ أسابيع", items: ["System Design Interview", "Algorithms & DS", "Portfolio & GitHub", "LinkedIn Optimization"], resources: [R("LeetCode", "https://leetcode.com"), R("NeetCode", "https://neetcode.io")] },
    ],
  },
  data: {
    beginner: [
      { phase: 1, title: "🐍 البايثون لعلم البيانات", duration: "٥ أسابيع", items: ["أساسيات Python", "NumPy & Pandas", "تنظيف وتحليل البيانات", "مشروع: تحليل بيانات حقيقية"], resources: [R("🎥 بايثون — الزيرو", "https://youtube.com/playlist?list=PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs"), R("Kaggle Learn (مجاني)", "https://kaggle.com/learn")] },
      { phase: 2, title: "التحليل والتصور", duration: "٤ أسابيع", items: ["Matplotlib & Seaborn", "Statistical Analysis", "Data Storytelling", "مشروع: Dashboard تحليلي"], resources: [R("Coursera Data Science — منح مجانية!", "https://coursera.org")] },
      { phase: 3, title: "Machine Learning", duration: "٨ أسابيع", items: ["Scikit-learn", "Supervised & Unsupervised Learning", "Model Evaluation", "مشروع: نموذج تنبؤ"], resources: [R("Andrew Ng ML (Coursera)", "https://coursera.org"), R("Fast.ai (مجاني)", "https://fast.ai")] },
      { phase: 4, title: "مشاريع وتحضير", duration: "٤ أسابيع", items: ["Kaggle Competitions", "SQL for Data Science", "Portfolio Projects", "LinkedIn & CV"], resources: [R("Kaggle", "https://kaggle.com")] },
    ],
    intermediate: [
      { phase: 1, title: "Deep Learning", duration: "٦ أسابيع", items: ["Neural Networks", "TensorFlow / PyTorch", "CNNs & RNNs", "مشروع: Image Classifier"], resources: [R("Fast.ai Part 2", "https://fast.ai"), R("Coursera Deep Learning — منح!", "https://coursera.org")] },
      { phase: 2, title: "NLP & LLMs", duration: "٤ أسابيع", items: ["Text Processing", "Transformers", "Hugging Face", "مشروع: Chatbot"], resources: [R("Hugging Face Course", "https://huggingface.co/course")] },
      { phase: 3, title: "MLOps", duration: "٤ أسابيع", items: ["Model Deployment", "MLflow", "Docker for ML", "مشروع: ML Pipeline"], resources: [R("MLOps Zoomcamp", "https://github.com/DataTalksClub/mlops-zoomcamp")] },
      { phase: 4, title: "تحضير للسوق", duration: "٤ أسابيع", items: ["Kaggle Portfolio", "Interview Prep", "System Design for ML", "Research Papers"], resources: [R("Papers With Code", "https://paperswithcode.com")] },
    ],
  },
  fullstack: {
    beginner: [
      { phase: 1, title: "أساسيات الويب", duration: "٤ أسابيع", items: ["HTML5, CSS3, JavaScript", "Responsive Design", "Git & GitHub", "مشروع: موقع شخصي"], resources: [R("freeCodeCamp", "https://freecodecamp.org"), R("The Odin Project", "https://theodinproject.com")] },
      { phase: 2, title: "Frontend Framework", duration: "٦ أسابيع", items: ["React Fundamentals", "State Management", "API Integration", "مشروع: تطبيق تفاعلي"], resources: [R("React Docs", "https://react.dev"), R("Coursera — منح مجانية!", "https://coursera.org")] },
      { phase: 3, title: "Backend + Database", duration: "٦ أسابيع", items: ["Node.js & Express", "MongoDB / PostgreSQL", "REST APIs", "مشروع: Full Stack App"], resources: [R("🎥 بايثون — الزيرو", "https://youtube.com/playlist?list=PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs"), R("MongoDB University", "https://university.mongodb.com")] },
      { phase: 4, title: "النشر والتحضير", duration: "٤ أسابيع", items: ["Docker Basics", "Cloud Deployment", "Testing", "Portfolio كامل"], resources: [R("Vercel", "https://vercel.com"), R("Railway", "https://railway.app")] },
    ],
    intermediate: [
      { phase: 1, title: "Advanced Full Stack", duration: "٨ أسابيع", items: ["Next.js", "TypeScript", "GraphQL", "مشروع: SaaS App"], resources: [R("Next.js Docs", "https://nextjs.org")] },
      { phase: 2, title: "Infrastructure", duration: "٤ أسابيع", items: ["CI/CD", "Docker & K8s", "Cloud Services", "مشروع: Scalable App"], resources: [R("AWS Free Tier", "https://aws.amazon.com/free/")] },
      { phase: 3, title: "System Design", duration: "٤ أسابيع", items: ["Architecture Patterns", "Caching & Queues", "DB Optimization", "مشروع: Complex System"], resources: [R("System Design Primer", "https://github.com/donnemartin/system-design-primer")] },
      { phase: 4, title: "تحضير للسوق", duration: "٤ أسابيع", items: ["Interview Prep", "Portfolio Polish", "Open Source", "Networking"], resources: [R("LeetCode", "https://leetcode.com")] },
    ],
  },
  mobile: {
    beginner: [
      { phase: 1, title: "أساسيات البرمجة", duration: "٤ أسابيع", items: ["Dart أو JavaScript", "OOP Concepts", "Version Control", "مشروع: تطبيق حاسبة"], resources: [R("Dart.dev", "https://dart.dev"), R("Coursera — منح مجانية!", "https://coursera.org")] },
      { phase: 2, title: "Flutter / React Native", duration: "٨ أسابيع", items: ["Widgets & Layouts", "State Management", "Navigation", "مشروع: تطبيق To-Do"], resources: [R("Flutter Docs", "https://flutter.dev"), R("React Native Docs", "https://reactnative.dev")] },
      { phase: 3, title: "APIs والبيانات", duration: "٤ أسابيع", items: ["REST API Integration", "Local Storage", "Firebase", "مشروع: تطبيق أخبار"], resources: [R("Firebase Docs", "https://firebase.google.com")] },
      { phase: 4, title: "النشر على المتاجر", duration: "٤ أسابيع", items: ["App Store / Play Store", "UI/UX Best Practices", "Testing", "نشر تطبيق حقيقي"], resources: [R("Play Console", "https://play.google.com/console")] },
    ],
    intermediate: [
      { phase: 1, title: "Advanced Mobile", duration: "٦ أسابيع", items: ["Advanced State", "Custom Animations", "Platform Channels", "مشروع: تطبيق متقدم"], resources: [R("Flutter Advanced", "https://flutter.dev")] },
      { phase: 2, title: "Backend for Mobile", duration: "٤ أسابيع", items: ["Firebase Advanced", "Supabase", "Push Notifications", "مشروع: Real-time App"], resources: [R("Supabase", "https://supabase.com")] },
      { phase: 3, title: "Performance & Testing", duration: "٤ أسابيع", items: ["Performance Optimization", "Unit & Integration Testing", "CI/CD for Mobile", "Production App"], resources: [R("Codemagic", "https://codemagic.io")] },
      { phase: 4, title: "تحضير للسوق", duration: "٤ أسابيع", items: ["Portfolio Apps", "Freelance Platforms", "Interview Prep", "App Store Optimization"], resources: [R("Upwork", "https://upwork.com")] },
    ],
  },
  devops: {
    beginner: [
      { phase: 0, title: "🐧 أساسيات Linux", duration: "٣ أسابيع", items: ["تنزيل Linux على VM", "Terminal وسطر الأوامر", "إدارة الملفات والصلاحيات", "Bash Scripting"], resources: [R("🎥 شرح Linux", "https://youtu.be/sWbUDq4S6Y8"), R("Linux Journey", "https://linuxjourney.com")] },
      { phase: 1, title: "الشبكات و Git", duration: "٣ أسابيع", items: ["Networking Basics", "Git & GitHub", "SSH & Keys", "مختبر: Git Workflow"], resources: [R("🎥 NetworkChuck", "https://youtube.com/@networkchuck"), R("GitHub Docs", "https://docs.github.com")] },
      { phase: 2, title: "Docker & Containers", duration: "٤ أسابيع", items: ["Docker Fundamentals", "Docker Compose", "Container Networking", "مشروع: Multi-container App"], resources: [R("Docker Getting Started", "https://docker.com/get-started"), R("Coursera DevOps — منح مجانية!", "https://coursera.org")] },
      { phase: 3, title: "CI/CD & Cloud", duration: "٦ أسابيع", items: ["GitHub Actions / Jenkins", "AWS / GCP Basics", "Terraform", "مشروع: CI/CD Pipeline"], resources: [R("AWS Free Tier", "https://aws.amazon.com/free/")] },
      { phase: 4, title: "Kubernetes وتحضير", duration: "٤ أسابيع", items: ["Kubernetes Basics", "Monitoring (Prometheus/Grafana)", "Home Lab", "شهادات: AWS/CKA"], resources: [R("Kubernetes Docs", "https://kubernetes.io/docs/")] },
    ],
    intermediate: [
      { phase: 1, title: "K8s متقدم", duration: "٦ أسابيع", items: ["Helm Charts", "Service Mesh", "GitOps (ArgoCD)", "مشروع: Production Cluster"], resources: [R("CKA Prep", "https://kubernetes.io/docs/")] },
      { phase: 2, title: "IaC & Automation", duration: "٤ أسابيع", items: ["Terraform Advanced", "Ansible", "Packer", "مشروع: Full IaC"], resources: [R("HashiCorp Learn", "https://learn.hashicorp.com")] },
      { phase: 3, title: "Observability", duration: "٤ أسابيع", items: ["ELK Stack", "Prometheus", "Jaeger Tracing", "مشروع: Monitoring Stack"], resources: [R("Grafana Academy", "https://grafana.com")] },
      { phase: 4, title: "SRE & Career", duration: "٤ أسابيع", items: ["SRE Principles", "Incident Management", "Chaos Engineering", "Interview Prep"], resources: [R("Google SRE Book", "https://sre.google/sre-book/table-of-contents/")] },
    ],
  },
  network: {
    beginner: [
      { phase: 0, title: "🐧 أساسيات Linux", duration: "أسبوعين", items: ["تنزيل Linux على VM", "Terminal أساسيات", "Network Tools (ping, traceroute)", "إدارة الملفات"], resources: [R("🎥 شرح Linux", "https://youtu.be/sWbUDq4S6Y8")] },
      { phase: 1, title: "أساسيات الشبكات", duration: "٦ أسابيع", items: ["OSI & TCP/IP", "IP Addressing & Subnetting", "Routing & Switching", "مختبر: Packet Tracer"], resources: [R("🎥 NetworkChuck", "https://youtube.com/@networkchuck"), R("Cisco Networking Academy", "https://skillsforall.com"), R("Coursera Networking — منح مجانية!", "https://coursera.org")] },
      { phase: 2, title: "CCNA تحضير", duration: "٨ أسابيع", items: ["VLANs & Trunking", "OSPF & EIGRP", "ACLs & NAT", "مختبر: شبكة Enterprise"], resources: [R("Jeremy's IT Lab (مجاني)", "https://youtube.com/@JeremysITLab"), R("Packet Tracer", "https://netacad.com")] },
      { phase: 3, title: "أمن الشبكات", duration: "٤ أسابيع", items: ["Firewall Basics", "VPN Configuration", "Wireless Security", "مختبر: تأمين شبكة"], resources: [R("🎥 دورة أمن شبكات (عربي)", "https://youtube.com/playlist?list=PLh2Jy0nKL_j1WZMzITHgUuzaadpSULlMm")] },
      { phase: 4, title: "شهادات وتحضير", duration: "٤ أسابيع", items: ["CCNA Exam Prep", "CompTIA Network+", "Home Lab", "LinkedIn & CV"], resources: [R("Boson Practice Exams", "https://boson.com")] },
    ],
    intermediate: [
      { phase: 1, title: "Advanced Routing", duration: "٦ أسابيع", items: ["BGP", "MPLS", "SD-WAN", "مشروع: Multi-site"], resources: [R("INE", "https://ine.com")] },
      { phase: 2, title: "Cloud Networking", duration: "٤ أسابيع", items: ["AWS VPC", "Azure Networking", "Hybrid Cloud", "مشروع: Cloud Architecture"], resources: [R("AWS Free Tier", "https://aws.amazon.com/free/")] },
      { phase: 3, title: "Automation", duration: "٤ أسابيع", items: ["Python for Networking", "Ansible for Network", "NETCONF/RESTCONF", "Automated Config"], resources: [R("Network Automation", "https://github.com/networktocode")] },
      { phase: 4, title: "CCNP و Career", duration: "٦ أسابيع", items: ["CCNP Enterprise", "Network Design", "Troubleshooting", "Interview Prep"], resources: [R("Cisco Learning Network", "https://learningnetwork.cisco.com")] },
    ],
  },
};

function generateSmartTips(a) {
  const tips = [];
  // Tips based on obstacle
  const obsTips = {
    sources: "التزم بالمصادر المذكورة بكل مرحلة فقط — لا تفتح يوتيوب عشوائي. المصادر هون مختارة بعناية عشان ما تضيع.",
    branch: "ما في فرع غلط — جرّب المسار اللي اخترته لمدة شهر. إذا ما حبيته غيّره. التجربة أفضل ألف مرة من التفكير بدون عمل.",
    motivation: "لا تعتمد على الحماس — اعتمد على العادات. حط ٢٠ دقيقة ثابتة يومياً وبعد ٣ أسابيع بتصير عادة أوتوماتيكية.",
    noplan: "هاي خارطتك — التزم فيها مرحلة بمرحلة. لا تبحث عن خطط ثانية — التشتت هو عدو التقدم.",
  };
  if (obsTips[a.obstacle]) tips.push(obsTips[a.obstacle]);
  // Tips based on device
  if (a.device === "mobile") tips.push("ابدأ بالمحتوى النظري والفيديوهات عالموبايل، وحاول تحصل على لابتوب مستعمل حتى لو بسيط — التطبيق العملي بيحتاج كومبيوتر.");
  // Tips based on hours
  if (a.hours === "5") tips.push("بـ ٥ ساعات بالأسبوع، ركّز على موضوع واحد بكل جلسة. الجودة أهم من الكمية — ساعة تركيز كامل أفضل من ٣ ساعات تشتت.");
  else if (a.hours === "40") tips.push("بما إنك متفرغ، استغل الوقت بالتطبيق العملي أكتر من المشاهدة. قاعدة ٢٠/٨٠: ٢٠٪ نظري و ٨٠٪ تطبيق.");
  // Tips based on goal
  const goalTips = {
    job: "ابني Portfolio قوي من المرحلة الأولى — كل مشروع بتعمله ضيفه على GitHub. الشركات بتهتم بالمشاريع أكتر من الشهادات.",
    freelance: "ابدأ بمشاريع صغيرة على Upwork أو Fiverr من المرحلة الثالثة — حتى لو ببلاش بالبداية. التقييمات الأولى هي الأهم.",
    skill: "حط هدف محدد لكل أسبوع — مثلاً 'هالأسبوع بدي أتعلم Flexbox'. الأهداف الصغيرة بتحفزك أكتر من الأهداف الكبيرة.",
    switch: "لا تترك شغلك الحالي — تعلّم بالتوازي وابني مشاريع. لما يصير عندك portfolio قوي، انتقل بثقة.",
  };
  if (goalTips[a.goal]) tips.push(goalTips[a.goal]);
  // Tips based on level
  if (a.level === "beginner" || a.level === "basic") tips.push("لا تقارن حالك بحدا — كل شخص بدأ من الصفر. ركّز على تقدمك أنت بس.");
  else tips.push("بما إنك عندك خبرة، ركّز على المشاريع المتقدمة والشهادات. هاد اللي بيفرقك عن الباقي بسوق العمل.");
  return tips.slice(0, 4);
}

const s = { card: (extra = {}) => ({ background: B.card, borderRadius: 16, border: `1px solid ${B.blL}`, overflow: "hidden", marginBottom: 20, ...extra }) };

function Opt({ selected, onClick, title, desc, icon, small }) {
  return (<button onClick={onClick} style={{ background: selected ? `linear-gradient(135deg,${B.or}22,${B.or}11)` : B.card, border: `2px solid ${selected ? B.or : B.blL}`, borderRadius: 16, padding: small ? "14px 16px" : "20px 24px", cursor: "pointer", textAlign: "right", direction: "rtl", transition: "all 0.3s", width: "100%", display: "flex", alignItems: "center", gap: 14, position: "relative", overflow: "hidden" }}>
    {selected && <div style={{ position: "absolute", top: 0, right: 0, width: 4, height: "100%", background: B.or }} />}
    {icon && <span style={{ fontSize: small ? 24 : 32, flexShrink: 0 }}>{icon}</span>}
    <div style={{ flex: 1 }}><div style={{ color: B.w, fontSize: small ? 15 : 17, fontWeight: 600, marginBottom: desc ? 4 : 0 }}>{title}</div>{desc && <div style={{ color: B.gD, fontSize: 13 }}>{desc}</div>}</div>
    {selected && <div style={{ width: 24, height: 24, borderRadius: 99, background: B.or, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: B.w, fontSize: 14 }}>✓</span></div>}
  </button>);
}

function Step1({ a, set }) { return (<div style={{ direction: "rtl" }}><h2 style={{ color: B.w, fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>اختر مسارك في الـ IT</h2><p style={{ color: B.g, textAlign: "center", marginBottom: 28, fontSize: 15 }}>اختر المسار اللي بدك تتعلمه</p><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>{TRACKS.map(t => <Opt key={t.id} selected={a.track === t.id} onClick={() => set({ ...a, track: t.id })} title={t.name} desc={t.desc} icon={t.icon} small />)}</div></div>); }
function Step2({ a, set }) { return (<div style={{ direction: "rtl", maxWidth: 500, margin: "0 auto" }}><h2 style={{ color: B.w, fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>شو مستواك الحالي؟</h2><p style={{ color: B.g, textAlign: "center", marginBottom: 28, fontSize: 15 }}>هاد بيساعدنا نحدد نقطة البداية</p><div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{LEVELS.map(l => <Opt key={l.id} selected={a.level === l.id} onClick={() => set({ ...a, level: l.id })} title={l.name} desc={l.desc} />)}</div></div>); }
function Step3({ a, set }) { return (<div style={{ direction: "rtl", maxWidth: 500, margin: "0 auto" }}><h2 style={{ color: B.w, fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>كم ساعة تقدر تدرس بالأسبوع؟</h2><p style={{ color: B.g, textAlign: "center", marginBottom: 28, fontSize: 15 }}>عشان نبني جدول واقعي</p><div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{HOURS.map(h => <Opt key={h.id} selected={a.hours === h.id} onClick={() => set({ ...a, hours: h.id })} title={h.name} desc={h.desc} icon="⏰" />)}</div></div>); }
function Step4({ a, set }) { return (<div style={{ direction: "rtl", maxWidth: 500, margin: "0 auto" }}><h2 style={{ color: B.w, fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>شو هدفك من التعلم؟</h2><p style={{ color: B.g, textAlign: "center", marginBottom: 28, fontSize: 15 }}>عشان نوجهك صح</p><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{GOALS.map(g => <Opt key={g.id} selected={a.goal === g.id} onClick={() => set({ ...a, goal: g.id })} title={g.name} icon={g.icon} />)}</div></div>); }
function Step5({ a, set }) {
  const obstacles = [
    { id: "sources", name: "كثرة المصادر وما بعرف من وين أبدأ", icon: "📚" },
    { id: "branch", name: "ما بعرف شو الفرع المناسب لي", icon: "🤷" },
    { id: "motivation", name: "ببدأ بحماس وبوقف بعد فترة", icon: "😔" },
    { id: "noplan", name: "ما عندي خطة واضحة أمشي عليها", icon: "🗺️" },
  ];
  return (<div style={{ direction: "rtl", maxWidth: 500, margin: "0 auto" }}>
    <h2 style={{ color: B.w, fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>شو أكتر شي مخليك توقف أو ما تبدأ؟</h2>
    <p style={{ color: B.g, textAlign: "center", marginBottom: 28, fontSize: 15 }}>عشان نعالج هالمشكلة بالخطة</p>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {obstacles.map(o => <Opt key={o.id} selected={a.obstacle === o.id} onClick={() => set({ ...a, obstacle: o.id })} title={o.name} icon={o.icon} />)}
    </div>
  </div>);
}
function Step6({ a, set }) {
  const devices = [
    { id: "pc", name: "عندي كومبيوتر (لابتوب أو ديسكتوب)", icon: "💻", desc: "جاهز للتطبيق العملي الكامل" },
    { id: "mobile", name: "عندي موبايل بس", icon: "📱", desc: "ممكن تتعلم نظري بس بتحتاج كومبيوتر للتطبيق" },
    { id: "both", name: "عندي الاثنين", icon: "🖥️", desc: "ممتاز — بتقدر تتعلم بأي وقت" },
  ];
  return (<div style={{ direction: "rtl", maxWidth: 500, margin: "0 auto" }}>
    <h2 style={{ color: B.w, fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>شو الجهاز اللي عندك؟</h2>
    <p style={{ color: B.g, textAlign: "center", marginBottom: 28, fontSize: 15 }}>هاد بيأثر على الخطة والأدوات اللي رح نقترحها</p>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {devices.map(d => <Opt key={d.id} selected={a.device === d.id} onClick={() => set({ ...a, device: d.id })} title={d.name} desc={d.desc} icon={d.icon} />)}
    </div>
  </div>);
}
function Step7({ a, set }) { return (<div style={{ direction: "rtl", maxWidth: 500, margin: "0 auto" }}><h2 style={{ color: B.w, fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>أي تفاصيل إضافية؟</h2><p style={{ color: B.g, textAlign: "center", marginBottom: 28, fontSize: 15 }}>اختياري</p><textarea value={a.details || ""} onChange={e => set({ ...a, details: e.target.value })} placeholder="مثلاً: عندي خبرة بالفوتوشوب، بدرس جامعة..." style={{ width: "100%", minHeight: 150, background: B.card, border: `2px solid ${B.blL}`, borderRadius: 16, padding: 20, color: B.w, fontSize: 15, direction: "rtl", resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} /></div>); }

function AISection() {
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
    <div style={s.card()}>
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

function CommitSection() {
  const tips = [
    { i: "📅", t: "حدد وقت ثابت يومياً للدراسة — حتى لو نص ساعة. الثبات أهم من الكمية." },
    { i: "📊", t: "تتبّع تقدمك — سجّل كل يوم شو تعلمت. بيحفزك لما تشوف كم قطعت." },
    { i: "🎯", t: "ركّز على مرحلة وحدة. ما تحاول تتعلم كل شي مع بعض." },
    { i: "💪", t: "لما تحس بالإحباط — هاد طبيعي ١٠٠٪. كل محترف مر بنفس الشعور." },
    { i: "🤝", t: "ابحث عن Study buddy — الرحلة مع شخص أسهل وأمتع." },
    { i: "🔄", t: "لا تخاف ترجع تراجع — التكرار مو ضعف، التكرار هو طريقة الدماغ يتعلم." },
  ];
  return (
    <div style={s.card()}>
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

function EnglishSection() {
  const tips = ["ابدأ بفيديوهات تقنية مع subtitles إنجليزية", "اكتب ملاحظاتك بالإنجليزي حتى لو غلط", "استخدم الـ AI ليترجم المصطلحات التقنية ويشرحها", "اقرأ Documentation بالإنجليزي — أهم مهارة رح تتعلمها", "تابع محتوى إنجليزي يومياً حتى لو ١٠ دقائق"];
  return (
    <div style={s.card()}>
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

function CourseraSection() {
  const steps = ["ادخل على coursera.org وسجّل حساب", "اختر الكورس اللي بدك إياه", "اضغط على \"Financial Aid\" تحت زر التسجيل", "اكتب سبب طلبك بصدق (ما بتحتاج تكون طويلة)", "انتظر ١-٢ أسبوع — وعادةً بتنقبل!"];
  return (
    <div style={s.card()}>
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

function PomodoroSection() {
  return (
    <div style={s.card()}>
      <div style={{ background: `linear-gradient(135deg,#EF444422,${B.card})`, padding: "20px 24px", borderBottom: "2px solid #EF444433" }}>
        <h2 style={{ color: B.w, fontSize: 22, fontWeight: 800, margin: 0 }}>⏱️ تنظيم الوقت — تقنية البومودورو</h2>
        <p style={{ color: B.g, fontSize: 14, marginTop: 8, lineHeight: 1.7 }}>واحدة من أفضل الطرق للدراسة الفعّالة. الفكرة بسيطة: ادرس ٢٥ دقيقة بتركيز كامل، بعدين خذ استراحة ٥ دقائق. بعد ٤ جلسات، خذ استراحة طويلة ١٥-٣٠ دقيقة.</p>
      </div>
      <div style={{ padding: "20px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
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

function DeviceNote({ device }) {
  if (device !== "mobile") return null;
  return (
    <div style={s.card({ border: `1px solid ${B.warn}33` })}>
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

function ObstacleNote({ obstacle }) {
  const notes = {
    sources: { icon: "📚", title: "كثرة المصادر؟ هاي الخطة هي الحل!", msg: "هاي الخارطة بتحدد لك بالضبط شو تتعلم ومن وين، خطوة بخطوة. لا تفتح يوتيوب عشوائي — التزم بالمصادر المذكورة بكل مرحلة وما تنتقل للمرحلة التالية إلا لما تخلص الأولى." },
    branch: { icon: "🤷", title: "ما بتعرف الفرع المناسب؟", msg: "ما في فرع \"غلط\" — كلهم فيهم فرص عمل. المهم تبدأ! جرّب المسار اللي اخترته لمدة شهر. إذا ما حبيته، غيّره. التجربة أفضل ألف مرة من التفكير بدون عمل." },
    motivation: { icon: "😔", title: "بتبدأ بحماس وبتوقف؟", msg: "هاد أشهر مشكلة! الحل: لا تعتمد على الحماس — اعتمد على العادات. حط وقت ثابت يومي حتى لو ٢٠ دقيقة. بعد ٣ أسابيع بيصير عادة أوتوماتيكية. واستخدم تقنية البومودورو اللي تحت." },
    noplan: { icon: "🗺️", title: "ما عندك خطة؟ هلق صار عندك!", msg: "هاي خارطة طريقك المخصصة بناءً على إجاباتك. كل مرحلة محددة بوقت ومصادر ومشاريع. التزم فيها وما تبحث عن خطط ثانية — التشتت هو عدو التقدم." },
  };
  const note = notes[obstacle];
  if (!note) return null;
  return (
    <div style={s.card({ border: `1px solid ${B.or}44` })}>
      <div style={{ padding: "20px 24px" }}>
        <h3 style={{ color: B.or, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{note.icon} {note.title}</h3>
        <p style={{ color: B.gL, fontSize: 14, lineHeight: 1.8, margin: 0 }}>{note.msg}</p>
      </div>
    </div>
  );
}

function Result({ a, tips }) {
  const lk = a.level === "beginner" || a.level === "basic" ? "beginner" : "intermediate";
  const tmpl = T[a.track]?.[lk] || T.frontend.beginner;
  const tr = TRACKS.find(t => t.id === a.track);
  const lv = LEVELS.find(l => l.id === a.level);
  const hr = HOURS.find(h => h.id === a.hours);
  const gl = GOALS.find(g => g.id === a.goal);
  return (
    <div style={{ direction: "rtl", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ background: `linear-gradient(135deg,${B.or},${B.orD})`, borderRadius: 20, padding: "32px 28px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 40 }}>{tr?.icon}</span>
            <div><h1 style={{ color: B.w, fontSize: 26, fontWeight: 800, margin: 0 }}>خارطة طريقك المخصصة</h1><p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, margin: "4px 0 0" }}>{tr?.name}</p></div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[{ l: "المستوى", v: lv?.name }, { l: "الوقت", v: hr?.name }, { l: "الهدف", v: gl?.name }].map((t, i) => (<span key={i} style={{ background: "rgba(255,255,255,0.2)", borderRadius: 99, padding: "6px 14px", fontSize: 13, color: B.w, fontWeight: 500 }}>{t.l}: {t.v}</span>))}
          </div>
        </div>
      </div>
      {tips?.length > 0 ? (<div style={{ ...s.card(), border: `1px solid ${B.or}33` }}><div style={{ padding: 24 }}><h3 style={{ color: B.or, fontSize: 18, fontWeight: 700, marginBottom: 16 }}>💡 نصائح مخصصة بناءً على إجاباتك</h3>{tips.map((t, i) => (<div key={i} style={{ background: `${B.or}11`, borderRadius: 12, padding: "12px 16px", marginBottom: 8, borderRight: `3px solid ${B.or}`, color: B.gL, fontSize: 14, lineHeight: 1.7 }}>{t}</div>))}</div></div>) : null}
      {tmpl.map((ph, i) => (
        <div key={i} style={s.card()}>
          <div style={{ background: `linear-gradient(90deg,${B.bl},${B.blL})`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 99, background: B.or, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: B.w }}>{ph.phase}</div>
              <h3 style={{ color: B.w, fontSize: 18, fontWeight: 700, margin: 0 }}>{ph.title}</h3>
            </div>
            <span style={{ color: B.or, fontSize: 13, fontWeight: 600, background: `${B.or}22`, padding: "4px 12px", borderRadius: 99 }}>{ph.duration}</span>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <h4 style={{ color: B.g, fontSize: 13, fontWeight: 600, marginBottom: 10, letterSpacing: 1 }}>المواضيع</h4>
            {ph.items.map((it, j) => (<div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, color: B.gL, fontSize: 14, lineHeight: 1.6, marginBottom: 6 }}><span style={{ color: B.or, marginTop: 2, flexShrink: 0 }}>▸</span>{it}</div>))}
            <h4 style={{ color: B.g, fontSize: 13, fontWeight: 600, marginBottom: 10, marginTop: 16, letterSpacing: 1 }}>مصادر مختارة</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {ph.resources.map((r, j) => (<a key={j} href={r.url} target="_blank" rel="noopener noreferrer" style={{ background: `${B.or}12`, color: B.orL, fontSize: 13, padding: "8px 14px", borderRadius: 12, fontWeight: 500, textDecoration: "none", display: "block" }}>📚 {r.name}</a>))}
            </div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 32 }}><ObstacleNote obstacle={a.obstacle} /><DeviceNote device={a.device} /><AISection /><CommitSection /><PomodoroSection /><EnglishSection /><CourseraSection /></div>
      <div style={{ background: `linear-gradient(135deg,${B.card},${B.blD})`, borderRadius: 16, padding: 28, marginTop: 24, textAlign: "center", border: `1px solid ${B.or}33` }}>
        <h3 style={{ color: B.w, fontSize: 22, fontWeight: 700, marginBottom: 12 }}>🚀 بدك خارطة طريق مفصّلة ومخصصة بالكامل؟</h3>
        <p style={{ color: B.gL, fontSize: 15, marginBottom: 8, lineHeight: 1.8 }}>هاي الخارطة بتعطيك نظرة عامة ممتازة — بس لو بدك خطة مفصّلة أكتر مبنية على وضعك بالضبط، مع:</p>
        <div style={{ textAlign: "right", direction: "rtl", maxWidth: 400, margin: "0 auto 20px", color: B.gL, fontSize: 14, lineHeight: 2 }}>
          <div>✅ مراجعة شخصية لمستواك وأهدافك</div>
          <div>✅ خطة أسبوعية مفصّلة بمواعيد ومهام</div>
          <div>✅ مصادر مختارة تناسب مستواك بالضبط</div>
          <div>✅ مشاريع عملية تبنيها خطوة بخطوة</div>
          <div>✅ متابعة ودعم شخصي من محمد</div>
        </div>
        <a href="https://instagram.com/muhammadbibi.cc" target="_blank" rel="noopener noreferrer" style={{ background: `linear-gradient(135deg,${B.or},${B.orD})`, color: B.w, padding: "14px 32px", borderRadius: 99, fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: `0 4px 20px ${B.or}44` }}>📩 تواصل مع محمد عالإنستغرام</a>
        <p style={{ color: B.g, fontSize: 14, marginTop: 16, lineHeight: 1.7 }}>راسلني على <span style={{ color: B.or, fontWeight: 700 }}>@muhammadbibi.cc</span> وقلّي "بدي خطة مخصصة" — وأنا ببنيلك خارطة طريق مفصّلة تمشي عليها بخطواتها</p>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState({});
  const [tips, setTips] = useState([]);
  const [ld] = useState(false);
  const [done, setDone] = useState(false);
  const ST = [Step1, Step2, Step3, Step4, Step5, Step6, Step7];
  const totalSteps = ST.length;
  const C = ST[step];
  const ok = () => { if (step === 0) return !!a.track; if (step === 1) return !!a.level; if (step === 2) return !!a.hours; if (step === 3) return !!a.goal; if (step === 4) return !!a.obstacle; if (step === 5) return !!a.device; return true; };
  const gen = () => {
    setDone(true);
    setTips(generateSmartTips(a));
  };
  const next = () => { if (step < totalSteps - 1) setStep(step + 1); else gen(); };
  const back = () => { if (done) { setDone(false); setStep(totalSteps - 1); } else if (step > 0) setStep(step - 1); };
  const restart = () => { setStep(0); setA({}); setTips([]); setDone(false); };
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg,${B.bg} 0%,${B.blD} 100%)`, fontFamily: "'Segoe UI',Tahoma,Geneva,Verdana,sans-serif", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>{[...Array(12)].map((_, i) => (<div key={i} style={{ position: "absolute", borderRadius: "50%", width: Math.random() * 4 + 2, height: Math.random() * 4 + 2, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, background: i % 3 === 0 ? B.or : B.blL, opacity: Math.random() * 0.3 + 0.1, animation: `f ${Math.random() * 10 + 10}s ease-in-out infinite`, animationDelay: `${Math.random() * 5}s` }} />))}<style>{`@keyframes f{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}`}</style></div>
      <div style={{ position: "relative", zIndex: 1, padding: "20px 16px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32, paddingTop: 16 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: B.card, padding: "10px 24px", borderRadius: 99, border: `1px solid ${B.blL}` }}>
            <span style={{ fontSize: 24 }}>🗺️</span><span style={{ color: B.w, fontSize: 18, fontWeight: 700 }}>IT Roadmap</span><span style={{ color: B.or, fontSize: 14 }}>by Muhammad</span>
          </div>
        </div>
        {!done ? (<>
          <div style={{ width: "100%", maxWidth: 500, margin: "0 auto 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ color: B.g, fontSize: 14 }}>الخطوة {step + 1} من {totalSteps}</span><span style={{ color: B.or, fontSize: 14, fontWeight: 700 }}>{Math.round(((step + 1) / totalSteps) * 100)}%</span></div>
            <div style={{ background: B.blL, borderRadius: 99, height: 6, overflow: "hidden" }}><div style={{ width: `${((step + 1) / totalSteps) * 100}%`, height: "100%", background: `linear-gradient(90deg,${B.or},${B.orL})`, borderRadius: 99, transition: "width 0.5s" }} /></div>
          </div>
          <div style={{ background: `${B.card}CC`, borderRadius: 24, padding: "32px 24px", border: `1px solid ${B.blL}`, backdropFilter: "blur(20px)", marginBottom: 24 }}><C a={a} set={setA} /></div>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, direction: "rtl" }}>
            {step > 0 && <button onClick={back} style={{ background: B.blL, color: B.w, border: "none", padding: "14px 32px", borderRadius: 99, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>← رجوع</button>}
            <button onClick={next} disabled={!ok()} style={{ background: ok() ? `linear-gradient(135deg,${B.or},${B.orD})` : B.blL, color: B.w, border: "none", padding: "14px 40px", borderRadius: 99, fontSize: 16, fontWeight: 700, cursor: ok() ? "pointer" : "not-allowed", opacity: ok() ? 1 : 0.5, boxShadow: ok() ? `0 4px 20px ${B.or}44` : "none" }}>{step === totalSteps - 1 ? "🚀 أنشئ خارطة الطريق" : "التالي →"}</button>
          </div>
        </>) : (<><Result a={a} tips={tips} /><div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24, direction: "rtl" }}><button onClick={restart} style={{ background: B.blL, color: B.w, border: "none", padding: "14px 32px", borderRadius: 99, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>🔄 ابدأ من جديد</button></div></>)}
      </div>
    </div>
  );
}
