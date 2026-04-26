import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";

type Dict = Record<string, string>;

const ar: Dict = {
  // Nav
  "nav.how": "كيف يعمل",
  "nav.features": "المميزات",
  "nav.why": "لماذا نحن",
  "nav.login": "تسجيل الدخول",
  "nav.start": "ابدأ الآن",

  // Hero
  "hero.badge": "مدعوم بالذكاء الاصطناعي",
  "hero.title.1": "تعلَّم الطب",
  "hero.title.2": "من خلال مرضى افتراضيين",
  "hero.desc":
    "منصّة للتعلم السريري التفاعلي مدعومة بالذكاء الاصطناعي، تساعد طلاب العلوم الصحية على بناء تفكيرهم الطبي بثقة.",
  "hero.cta": "ابدأ أول حالة مجانًا",
  "hero.session": "جلسة نشطة الآن",
  "hero.virtualPatient": "المريض الافتراضي",

  // Stats
  "stats.cases": "حالة سريرية",
  "stats.specialties": "تخصصًا طبيًا",
  "stats.satisfaction": "رضا الطلاب",
  "stats.casesNum": "+200",
  "stats.specialtiesNum": "12",
  "stats.satisfactionNum": "98%",

  // How
  "how.eyebrow": "آلية العمل",
  "how.title": "رحلة سريرية متكاملة في أربع خطوات",
  "how.desc": "تحاكي المنصة بيئة العيادة الحقيقية لتمنحك تدريبًا عمليًا قبل التطبيق على المرضى.",
  "how.s1.title": "اختر حالة سريرية",
  "how.s1.desc": "تصفّح مكتبة واسعة من الحالات الواقعية واختر التخصص الذي تريد التدرّب عليه.",
  "how.s2.title": "تحدّث مع المريض الافتراضي",
  "how.s2.desc": "ابدأ مقابلة سريرية ذكية، اطرح الأسئلة، واجمع التاريخ المرضي بأسلوب طبيعي.",
  "how.s3.title": "افحص الحالة واطلب الفحوصات",
  "how.s3.desc": "حدّد الفحص السريري المناسب واطلب التحاليل والصور الإشعاعية بناءً على تفكيرك.",
  "how.s4.title": "شخّص الحالة واحصل على تقييم ذكي",
  "how.s4.desc": "قدّم تشخيصك واحصل على تقرير تفصيلي يبرز نقاط القوة وفرص التحسين.",

  // Features
  "features.eyebrow": "المميزات",
  "features.title": "أدوات صُمِّمت خصيصًا للطالب الطبي",
  "features.desc": "كل ما تحتاجه لتطوير تفكيرك السريري في منصة واحدة متكاملة.",
  "features.f1.t": "مرضى افتراضيون أذكياء",
  "features.f1.d": "محادثات طبيعية مع شخصيات مرضى متنوعة الأعمار والحالات.",
  "features.f2.t": "تحليل أداء شخصي",
  "features.f2.d": "لوحة تتبّع نقاط قوتك وتكشف الفجوات المعرفية في كل تخصص.",
  "features.f3.t": "حالات تتكيّف معك",
  "features.f3.d": "خوارزمية ذكية تختار الحالات التالية بناءً على مستواك واحتياجاتك.",
  "features.f4.t": "مرجعية علمية موثوقة",
  "features.f4.d": "كل التشخيصات والإرشادات مبنية على المراجع الطبية المعتمدة عالميًا.",
  "features.f5.t": "محتوى احترافي",
  "features.f5.d": "مصطلحات طبية دقيقة لتدعم الطالب في رحلته السريرية.",
  "features.f6.t": "بيئة آمنة للتعلم",
  "features.f6.d": "تدرّب وتخطئ دون أي مخاطر — كل خطأ هنا هو خطوة نحو إتقان أعمق.",

  // Why
  "why.eyebrow": "لماذا تهمّك هذه المنصة",
  "why.title": "لأن الطبيب الجيد لا يولد من الكتب وحدها",
  "why.desc":
    "في كليات العلوم الصحية، الفجوة بين المعرفة النظرية والممارسة السريرية هي التحدّي الأكبر. منصّتنا تختصر هذه الفجوة بتدريب آمن وذكي يحاكي الواقع.",
  "why.aud.1": "طلاب الطب البشري وطب الأسنان",
  "why.aud.2": "طلاب التمريض والصيدلة السريرية",
  "why.aud.3": "طلاب العلاج الطبيعي والمختبرات الطبية",
  "why.p1.t": "جسر بين النظرية والتطبيق",
  "why.p1.d": "حوّل ما تدرسه في الكتب إلى مهارات سريرية حقيقية يمكن قياسها.",
  "why.p2.t": "تدرّب في أي وقت ومن أي مكان",
  "why.p2.d": "لا حاجة للانتظار حتى المناوبة — تعلَّم بإيقاعك الخاص.",
  "why.p3.t": "ثقة أكبر مع المرضى الحقيقيين",
  "why.p3.d": "ابنِ تفكيرك السريري قبل دخول المستشفى لأول مرة.",
  "why.p4.t": "استعداد قوي للامتحانات",
  "why.p4.d": "حالات تحاكي امتحانات OSCE والـClinical Reasoning بشكل دقيق.",

  // Footer
  "footer.tagline":
    "منصّة للتعلم السريري التفاعلي مدعومة بالذكاء الاصطناعي، تساعد طلاب العلوم الصحية على بناء تفكيرهم الطبي بثقة.",
  "footer.platform": "المنصة",
  "footer.contact": "تواصل",
  "footer.support": "الدعم الفني",
  "footer.partnerships": "الشراكات الأكاديمية",
  "footer.blog": "المدوّنة العلمية",
  "footer.rights": "جميع الحقوق محفوظة.",
  "footer.privacy": "سياسة الخصوصية",
  "footer.terms": "الشروط والأحكام",

  // Auth
  "auth.login.title": "مرحبًا بعودتك",
  "auth.login.subtitle": "سجّل دخولك لمتابعة رحلتك السريرية",
  "auth.signup.title": "ابدأ رحلتك الطبية",
  "auth.signup.subtitle": "أنشئ حسابك المجاني وانضم إلى آلاف الطلاب",
  "auth.email": "البريد الإلكتروني",
  "auth.password": "كلمة المرور",
  "auth.fullName": "الاسم الكامل",
  "auth.forgot": "نسيت كلمة المرور؟",
  "auth.login.cta": "تسجيل الدخول",
  "auth.login.loading": "جارٍ الدخول...",
  "auth.signup.cta": "إنشاء الحساب",
  "auth.signup.loading": "جارٍ الإنشاء...",
  "auth.noAccount": "ليس لديك حساب؟",
  "auth.haveAccount": "لديك حساب؟",
  "auth.createAccount": "أنشئ حسابًا جديدًا",
  "auth.signin": "سجّل الدخول",
  "auth.terms": "بإنشاء الحساب فإنك توافق على شروط الاستخدام وسياسة الخصوصية",
};

const en: Dict = {
  "nav.how": "How it works",
  "nav.features": "Features",
  "nav.why": "Why us",
  "nav.login": "Sign in",
  "nav.start": "Get started",

  "hero.badge": "Powered by AI",
  "hero.title.1": "Learn medicine",
  "hero.title.2": "through virtual patients",
  "hero.desc":
    "An interactive clinical learning platform powered by AI, helping health-science students build their clinical reasoning with confidence.",
  "hero.cta": "Start your first case free",
  "hero.session": "Active session",
  "hero.virtualPatient": "Virtual patient",

  "stats.cases": "clinical cases",
  "stats.specialties": "medical specialties",
  "stats.satisfaction": "student satisfaction",
  "stats.casesNum": "200+",
  "stats.specialtiesNum": "12",
  "stats.satisfactionNum": "98%",

  "how.eyebrow": "How it works",
  "how.title": "A complete clinical journey in four steps",
  "how.desc": "The platform mirrors a real clinic to give you hands-on practice before treating real patients.",
  "how.s1.title": "Pick a clinical case",
  "how.s1.desc": "Browse a wide library of realistic cases and choose the specialty you want to train on.",
  "how.s2.title": "Talk to the virtual patient",
  "how.s2.desc": "Run a smart clinical interview, ask questions, and gather the history naturally.",
  "how.s3.title": "Examine and order tests",
  "how.s3.desc": "Pick the right physical exam and request the labs and imaging your reasoning calls for.",
  "how.s4.title": "Diagnose and get smart feedback",
  "how.s4.desc": "Submit your diagnosis and receive a detailed report highlighting strengths and gaps.",

  "features.eyebrow": "Features",
  "features.title": "Tools built for the medical student",
  "features.desc": "Everything you need to grow your clinical thinking in one integrated platform.",
  "features.f1.t": "Smart virtual patients",
  "features.f1.d": "Natural conversations with patients across ages and conditions.",
  "features.f2.t": "Personal performance analytics",
  "features.f2.d": "A dashboard that tracks your strengths and reveals knowledge gaps per specialty.",
  "features.f3.t": "Adaptive cases",
  "features.f3.d": "A smart engine that picks the next case based on your level and needs.",
  "features.f4.t": "Trusted scientific references",
  "features.f4.d": "All diagnoses and guidelines are based on internationally recognized medical references.",
  "features.f5.t": "Professional content",
  "features.f5.d": "Precise medical terminology to support students throughout their clinical journey.",
  "features.f6.t": "Safe learning environment",
  "features.f6.d": "Practice and make mistakes risk-free — every error is a step toward mastery.",

  "why.eyebrow": "Why this matters",
  "why.title": "Because great doctors aren't born from textbooks alone",
  "why.desc":
    "In health-science colleges, the gap between theory and clinical practice is the biggest challenge. Our platform closes that gap with safe, smart, realistic training.",
  "why.aud.1": "Medical and dental students",
  "why.aud.2": "Nursing and clinical pharmacy students",
  "why.aud.3": "Physical therapy and lab science students",
  "why.p1.t": "Bridge theory and practice",
  "why.p1.d": "Turn what you learn in books into measurable clinical skills.",
  "why.p2.t": "Train anywhere, anytime",
  "why.p2.d": "No need to wait for your shift — learn at your own pace.",
  "why.p3.t": "More confidence with real patients",
  "why.p3.d": "Build your clinical thinking before stepping into the hospital.",
  "why.p4.t": "Strong exam preparation",
  "why.p4.d": "Cases that closely simulate OSCE and Clinical Reasoning exams.",

  "footer.tagline":
    "An interactive clinical learning platform powered by AI, helping health-science students build their clinical reasoning with confidence.",
  "footer.platform": "Platform",
  "footer.contact": "Contact",
  "footer.support": "Support",
  "footer.partnerships": "Academic partnerships",
  "footer.blog": "Blog",
  "footer.rights": "All rights reserved.",
  "footer.privacy": "Privacy policy",
  "footer.terms": "Terms & conditions",

  "auth.login.title": "Welcome back",
  "auth.login.subtitle": "Sign in to continue your clinical journey",
  "auth.signup.title": "Start your medical journey",
  "auth.signup.subtitle": "Create your free account and join thousands of students",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.fullName": "Full name",
  "auth.forgot": "Forgot password?",
  "auth.login.cta": "Sign in",
  "auth.login.loading": "Signing in...",
  "auth.signup.cta": "Create account",
  "auth.signup.loading": "Creating...",
  "auth.noAccount": "Don't have an account?",
  "auth.haveAccount": "Already have an account?",
  "auth.createAccount": "Create a new account",
  "auth.signin": "Sign in",
  "auth.terms": "By creating an account you agree to the Terms of Use and Privacy Policy",
};

const dicts: Record<Lang, Dict> = { ar, en };

type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
};

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = (localStorage.getItem("medsim.lang") as Lang | null) ?? "ar";
    setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("medsim.lang", l);
  };

  const t = (key: string) => dicts[lang][key] ?? key;
  const dir = lang === "ar" ? "rtl" : "ltr";
  return <I18nContext.Provider value={{ lang, setLang, t, dir }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
