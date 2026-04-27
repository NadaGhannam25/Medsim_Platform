// Provides English mirrors for case content. When lang === "en" we map known
// Arabic strings to English equivalents; unknown values fall back to the
// original (which is acceptable for medical abbreviations / proper nouns).
import type { Lang } from "@/lib/i18n";
import type { LearningCase } from "@/data/case-flow";

const NAMES: Record<string, string> = {
  "أحمد المطيري": "Ahmed Al-Mutairi",
  "نورة العتيبي": "Noura Al-Otaibi",
  "خالد الدوسري": "Khalid Al-Dosari",
  "سعد الحربي": "Saad Al-Harbi",
  "فاطمة الزهراني": "Fatima Al-Zahrani",
  "ليان القحطاني": "Layan Al-Qahtani",
  "ماجد السبيعي": "Majed Al-Subaie",
  "هند الشمري": "Hind Al-Shammari",
  "يزيد الغامدي": "Yazeed Al-Ghamdi",
  "ريم الفيفي": "Reem Al-Faifi",
  "عبدالله الدوسري": "Abdullah Al-Dosari",
  "سلمى الحربي": "Salma Al-Harbi",
};

const TEXT: Record<string, string> = {
  // gender
  "ذكر": "Male", "أنثى": "Female",
  // difficulty
  "مبتدئ": "Beginner", "متوسط": "Intermediate", "متقدم": "Advanced",
  // none
  "لا توجد": "None", "لا يوجد": "None",
  // specialties
  "طب الطوارئ / القلب": "Emergency Medicine / Cardiology",
  "الجراحة العامة": "General Surgery",
  "طب الأعصاب": "Neurology",
  "العظام / الأعصاب": "Orthopedics / Neurology",
  "الصدرية / الطوارئ": "Pulmonary / Emergency",
  "الباطنية / الجهاز الهضمي": "Internal Medicine / GI",
  "الباطنية / الأعصاب": "Internal Medicine / Neurology",
  "تدريب سريري عام": "General clinical training",
  // categories
  "ألم في الصدر": "Chest pain",
  "ألم في البطن": "Abdominal pain",
  "صداع شديد": "Severe headache",
  "ألم أسفل الظهر": "Lower back pain",
  "ضيق في التنفس": "Shortness of breath",
  "ألم بطني علوي": "Upper abdominal pain",
  "دوخة وصداع": "Dizziness and headache",
  "ألم بطني — حامل": "Abdominal pain — pregnant",
  "حمى وسعال — طفل": "Fever and cough — child",
  "خفقان — مراهقة": "Palpitations — teen",
  "سقوط — مسن": "Fall — elderly",
  "حمى وتيبس رقبة": "Fever and neck stiffness",
  // chief complaints
  "ألم ضاغط في منتصف الصدر منذ ساعتين، ينتشر للذراع الأيسر":
    "Crushing central chest pain for 2 hours radiating to the left arm",
  "ألم حاد في الجهة اليمنى السفلى من البطن منذ ٨ ساعات":
    "Sharp right-lower-quadrant abdominal pain for 8 hours",
  "صداع نابض في الجهة اليمنى من الرأس منذ ٤ ساعات مع غثيان":
    "Throbbing right-sided headache for 4 hours with nausea",
  "ألم أسفل الظهر ينتشر للساق اليمنى منذ ٣ أيام بعد رفع حمل ثقيل":
    "Lower back pain radiating to the right leg for 3 days after heavy lifting",
  "ضيق نفس متزايد منذ يومين مع سعال وأزيز":
    "Worsening shortness of breath for 2 days with cough and wheezing",
  "ألم حارق أعلى البطن بعد الوجبات مع غثيان خفيف":
    "Burning upper-abdominal pain after meals with mild nausea",
  "صداع خلفي مع دوخة وارتفاع ضغط منذ يوم":
    "Occipital headache with dizziness and high BP for 1 day",
  "ألم أسفل البطن في الحمل بالأسبوع ٢٤ مع شعور بانقباضات":
    "Lower abdominal pain at 24 weeks of pregnancy with cramping sensations",
  "حمى منذ يومين مع سعال وضيق نفس خفيف وفقدان شهية":
    "Fever for 2 days with cough, mild dyspnea and loss of appetite",
  "خفقان متكرر مع دوخة خفيفة عند المجهود منذ شهر":
    "Recurrent palpitations with mild exertional dizziness for 1 month",
  "ألم في الورك الأيمن بعد سقوط بسيط في المنزل وعدم القدرة على المشي":
    "Right hip pain after a simple fall at home, unable to ambulate",
  "صداع شديد مع حمى وتيبس في الرقبة وحساسية للضوء منذ اليوم":
    "Severe headache with fever, neck stiffness and photophobia since today",
  // brief summaries
  "ألم صدري ضاغط مع عوامل خطورة قلبية يحتاج تمييزًا سريعًا بين أسباب قلبية وغير قلبية.":
    "Crushing chest pain with cardiac risk factors — needs rapid differentiation of cardiac vs non-cardiac causes.",
  "ألم حاد في الربع السفلي الأيمن مع حرارة خفيفة، مناسب لتدريب توطين ألم البطن.":
    "Sharp RLQ pain with low-grade fever — suitable for training abdominal pain localization.",
  "صداع نابض موضع في الصدغ مع غثيان، يختبر دقة توطين أعراض الرأس والتمييز العصبي.":
    "Throbbing temporal headache with nausea — tests headache localization and neurological reasoning.",
  "ألم أسفل الظهر ينتشر للساق بعد حمل ثقيل، مناسب لتقييم عرق النسا والفحص العصبي.":
    "Lower back pain radiating to the leg after heavy lifting — suitable for sciatica assessment.",
  "ضيق نفس مع أزيز وتاريخ ربو، يركز على تقييم الجهاز التنفسي وخطورة نقص الأكسجة.":
    "Dyspnea with wheeze and asthma history — focuses on respiratory assessment and hypoxia severity.",
  "حالة إضافية للتدريب على المقابلة والفحص واتخاذ القرار.":
    "Additional case for practicing interview, exam and clinical decision making.",
  "ألم شرسوفي بعد الوجبات مع استخدام NSAIDs، مناسب لتدريب التفريق بين أسباب ألم أعلى البطن.":
    "Epigastric pain after meals with NSAID use — practice differentiating upper abdominal pain causes.",
  "صداع خلفي مع ضغط مرتفع، يركز على تقييم شدة ارتفاع الضغط وعلامات الخطر العصبية.":
    "Occipital headache with elevated BP — focuses on hypertension severity and neurological red flags.",
  // correct diagnoses
  "متلازمة الشريان التاجي الحادة": "Acute coronary syndrome",
  "التهاب الزائدة الدودية الحاد": "Acute appendicitis",
  "نوبة شقيقة": "Migraine attack",
  "عرق النسا بسبب تهيج جذور الأعصاب القطنية": "Sciatica due to lumbar nerve root irritation",
  "نوبة ربو حادة": "Acute asthma exacerbation",
  "التهاب المعدة / عسر هضم مرتبط بمضادات الالتهاب": "Gastritis / NSAID-related dyspepsia",
  "ارتفاع ضغط غير مضبوط مع صداع يحتاج تقييم علامات الخطورة": "Uncontrolled hypertension with headache — needs red-flag evaluation",
  "—": "—",
};

function tr(s: string): string {
  return TEXT[s] ?? s;
}

function trArr(arr: string[]): string[] {
  return arr.map(tr);
}

export function localizeCase(c: LearningCase, lang: Lang): LearningCase {
  if (lang === "ar") return c;
  return {
    ...c,
    categoryLabel: tr(c.categoryLabel),
    chiefComplaint: tr(c.chiefComplaint),
    briefSummary: tr(c.briefSummary),
    specialty: tr(c.specialty),
    difficulty: tr(c.difficulty) as LearningCase["difficulty"],
    correctDiagnosis: tr(c.correctDiagnosis),
    pastMedicalHistory: trArr(c.pastMedicalHistory),
    allergies: trArr(c.allergies),
    chronicDiseases: trArr(c.chronicDiseases),
    medications: trArr(c.medications),
    previousDiagnoses: trArr(c.previousDiagnoses),
    patient: {
      ...c.patient,
      name: NAMES[c.patient.name] ?? c.patient.name,
      gender: (tr(c.patient.gender) as LearningCase["patient"]["gender"]),
    },
  };
}

// Translate a vital value: convert Arabic-Indic digits to ASCII for English UI.
const AR_DIGITS: Record<string, string> = {
  "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٪":"%",
};

export function localizeVital(v: string, lang: Lang): string {
  if (lang === "ar") return v;
  return v.replace(/[٠-٩٪]/g, (d) => AR_DIGITS[d] ?? d);
}
