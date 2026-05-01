const fs = require('fs');

let content = fs.readFileSync('src/pages/Landing.tsx', 'utf8');

// Add imports
content = content.replace(
  "import { cn } from '@/shared/utils/cn';",
  "import { cn } from '@/shared/utils/cn';\nimport { useLanguage } from '@/shared/context/LanguageContext';\nimport { landingTranslations } from '@/shared/translations/landing';"
);

// Add hooks inside component
content = content.replace(
  "export default function Landing() {",
  "export default function Landing() {\n  const { lang, toggleLang, isRtl } = useLanguage();\n  const t = landingTranslations[lang];"
);

// Replace dir tag
content = content.replace('dir="rtl"', 'dir={isRtl ? "rtl" : "ltr"}');

// Replace language toggle
content = content.replace(
  '<button onClick={() => setIsDark(!isDark)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#0D1B2A] dark:hover:text-white transition-colors">',
  '<button onClick={() => setIsDark(!isDark)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#0D1B2A] dark:hover:text-white transition-colors">\n            {isDark ? <Sun size={20} /> : <Moon size={20} />}\n          </button>\n          <button onClick={toggleLang} className="px-3 py-1 text-sm font-bold bg-gray-100 dark:bg-white/10 rounded-full mx-2">\n            {lang === "en" ? "عربي" : "EN"}\n          </button>\n          {/* hide old theme toggle internal details */}'
);
content = content.replace('{isDark ? <Sun size={20} /> : <Moon size={20} />}', '');

// Nav links array
content = content.replace(
  /const navLinks = \[\s*{\s*name:\s*'الرئيسية'[\s\S]*?\];/m,
  "const navLinks = [\n    { name: t.nav.home, id: 'home' },\n    { name: t.nav.howItWorks, id: 'how-it-works' },\n    { name: t.nav.about, id: 'about' },\n    { name: t.nav.aiJustice, id: 'ai-justice' },\n    { name: t.nav.pricing, id: 'pricing' },\n    { name: t.nav.faq, id: 'faq' },\n  ];"
);
content = content.replace(
  /const faqs = \[\s*{\s*q:\s*"ما هو نظام الضمان المالي[\s\S]*?\];/m,
  "const faqs = [\n    { q: t.faq.q1, a: t.faq.a1 },\n    { q: t.faq.q2, a: t.faq.a2 },\n    { q: t.faq.q3, a: t.faq.a3 },\n    { q: t.faq.q4, a: t.faq.a4 },\n  ];"
);

// Login and register buttons in nav
content = content.replace(/>دخول<\/Link>/g, ">{t.nav.login}</Link>");
content = content.replace(/>إنشاء حساب<\/Link>/g, ">{t.nav.register}</Link>");

// Hero texts
content = content.replace('معيار جديد للعمل الحر في الشرق الأوسط', '{t.hero.badge}');
content = content.replace('احمِ أموالك.', '{t.hero.title1}');
content = content.replace('وضمان حقوقك.', '{t.hero.title2}');
content = content.replace('نظام ضمان احترافي (Escrow) مصمم خصيصاً للمستقلين العرب. نحول مجهودك الإبداعي إلى تعويض مضمون.', '{t.hero.subtitle}');
content = content.replace('ابدأ الآن', '{t.hero.startBtn}');
content = content.replace('كيف يعمل النظام', '{t.hero.howItWorksBtn}');
content = content.replace('خزنة الضمان (Escrow)', '{t.hero.escrowVault}');
content = content.replace('بيئة آمنة تضمن حقوق الطرفين.', '{t.hero.escrowDesc}');
content = content.replace('تم الإنجاز', '{t.hero.success}');
content = content.replace('تم تحرير الدفعات بنجاح', '{t.hero.released}');
content = content.replace(/>المصمم</g, ">{t.hero.designer}<");
content = content.replace(/>المطور</g, ">{t.hero.developer}<");
content = content.replace('نسبة العدالة', '{t.hero.justiceRatio}');
content = content.replace('تسعير عادل للمنطقة', '{t.hero.fairPricing}');

content = content.replace('تشفير عسكري', '{t.hero.features[0]}');
content = content.replace('ضمان مالي 100%', '{t.hero.features[1]}');
content = content.replace('هوية موثقة', '{t.hero.features[2]}');

// More strings
content = content.replace('حماية مطلقة للأموال', '{t.vault.badge}');
content = content.replace('خزنة كفيل الرقمية', '{t.vault.title1}');
content = content.replace('حيث تنام أموالك بسلام.', '{t.vault.title2}');
content = content.replace('عندما تودع ميزانية المشروع، لا تذهب لجيوبنا ولا لجيوب المستقل مباشرة. هي تظل في حساب بنكي مشفر ومؤمن، ولا يتم تحريرها إلا عندما تضغط أنت على "استلام العمل".', '{t.vault.desc}');
content = content.replace('تشفير AES-256', '{t.vault.f1_title}');
content = content.replace('تشفير كامل لبياناتك المالية.', '{t.vault.f1_desc}');
content = content.replace('تحرير ذكي', '{t.vault.f2_title}');
content = content.replace('صرف آلي بناءً على الإنجاز.', '{t.vault.f2_desc}');

fs.writeFileSync('src/pages/Landing.tsx', content);
