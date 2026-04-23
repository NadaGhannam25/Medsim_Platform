// Clinical case dataset for the examination simulator.
// Each case includes patient identity, EMR summary, visits, and the body
// regions that are clinically relevant for smart feedback.

export type BodyRegionId =
  | "head" | "neck" | "chest" | "abdomen" | "pelvis"
  | "shoulder-left" | "shoulder-right"
  | "arm-left" | "arm-right"
  | "hand-left" | "hand-right"
  | "leg-left" | "leg-right"
  | "foot-left" | "foot-right"
  | "upper-back" | "lower-back" | "buttocks";

export type CaseCategory =
  | "chest-pain" | "abdominal-pain" | "headache" | "lower-back-pain" | "shortness-of-breath";

export type Visit = {
  id: string;
  date: string;
  reason: string;
  summary: string;
  details: string;
};

export type ClinicalCase = {
  id: string;
  category: CaseCategory;
  categoryLabel: string;
  patient: {
    name: string;
    age: number;
    gender: "ذكر" | "أنثى";
    mrn: string;
    avatarColor: string;
  };
  chiefComplaint: string;
  pastMedicalHistory: string[];
  allergies: string[];
  chronicDiseases: string[];
  medications: string[];
  previousDiagnoses: string[];
  visits: Visit[];
  // Regions clinically expected for this case → used for smart feedback
  expectedRegions: BodyRegionId[];
  vitals: { hr: string; bp: string; temp: string; rr: string; spo2: string };
};

export const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: "case-001",
    category: "chest-pain",
    categoryLabel: "ألم في الصدر",
    patient: { name: "أحمد المطيري", age: 54, gender: "ذكر", mrn: "MRN-100482", avatarColor: "from-rose-400 to-rose-600" },
    chiefComplaint: "ألم ضاغط في منتصف الصدر منذ ساعتين، ينتشر للذراع الأيسر",
    pastMedicalHistory: ["احتشاء عضلة قلبية بسيط ٢٠١٩", "قسطرة تشخيصية ٢٠٢٠"],
    allergies: ["البنسلين"],
    chronicDiseases: ["ارتفاع ضغط الدم", "السكري النوع الثاني", "ارتفاع الكوليسترول"],
    medications: ["أملوديبين ٥ ملغ", "ميتفورمين ٥٠٠ ملغ", "أتورفاستاتين ٢٠ ملغ", "أسبرين ٨١ ملغ"],
    previousDiagnoses: ["متلازمة شريان تاجي مزمنة", "ذبحة صدرية مستقرة"],
    visits: [
      { id: "v1", date: "٢٠٢٤/١١/٠٢", reason: "متابعة ضغط الدم", summary: "ضغط مضبوط، تعديل الجرعة", details: "BP 130/85، الفحص السريري طبيعي. استمرار العلاج مع متابعة بعد ٣ أشهر." },
      { id: "v2", date: "٢٠٢٤/٠٧/١٥", reason: "ألم صدري عابر", summary: "ECG طبيعي، Troponin سلبي", details: "ألم خفيف زال بالراحة. أُجري ECG وتحاليل قلب. خرج على نتروجلسرين عند الحاجة." },
      { id: "v3", date: "٢٠٢٣/١٢/٢٠", reason: "فحص دوري", summary: "HbA1c 7.8%", details: "تعديل خطة السكري والنظام الغذائي. تحويل لاختصاصي تغذية." },
    ],
    expectedRegions: ["chest", "shoulder-left", "arm-left", "neck"],
    vitals: { hr: "١١٢", bp: "١٥٠/٩٥", temp: "٣٧.١", rr: "٢٢", spo2: "٩٦٪" },
  },
  {
    id: "case-002",
    category: "abdominal-pain",
    categoryLabel: "ألم في البطن",
    patient: { name: "نورة العتيبي", age: 28, gender: "أنثى", mrn: "MRN-100617", avatarColor: "from-amber-400 to-amber-600" },
    chiefComplaint: "ألم حاد في الجهة اليمنى السفلى من البطن منذ ٨ ساعات",
    pastMedicalHistory: ["استئصال زائدة دودية — لا"],
    allergies: ["لا توجد"],
    chronicDiseases: ["لا توجد"],
    medications: ["مكملات حديد"],
    previousDiagnoses: ["فقر دم بعوز الحديد"],
    visits: [
      { id: "v1", date: "٢٠٢٤/٠٩/١٠", reason: "إعياء عام", summary: "Hb 10.2 — وُصف الحديد", details: "أعراض إعياء وضعف. تحاليل أظهرت أنيميا. بدأ علاج الحديد لمدة ٣ أشهر." },
      { id: "v2", date: "٢٠٢٤/٠٣/٠٥", reason: "صداع متكرر", summary: "صداع توتري", details: "نُصحت بتقليل الكافيين وتمارين استرخاء." },
    ],
    expectedRegions: ["abdomen", "pelvis", "lower-back"],
    vitals: { hr: "١٠٢", bp: "١١٨/٧٥", temp: "٣٨.٢", rr: "١٨", spo2: "٩٩٪" },
  },
  {
    id: "case-003",
    category: "headache",
    categoryLabel: "صداع شديد",
    patient: { name: "خالد الدوسري", age: 35, gender: "ذكر", mrn: "MRN-100829", avatarColor: "from-indigo-400 to-indigo-600" },
    chiefComplaint: "صداع نابض في الجهة اليمنى من الرأس منذ ٤ ساعات مع غثيان",
    pastMedicalHistory: ["نوبات صداع نصفي منذ المراهقة"],
    allergies: ["لا توجد"],
    chronicDiseases: ["صداع نصفي"],
    medications: ["سوماتريبتان عند الحاجة"],
    previousDiagnoses: ["شقيقة مع هالة بصرية"],
    visits: [
      { id: "v1", date: "٢٠٢٤/١٠/١٨", reason: "نوبة شقيقة", summary: "استجابة للتريبتان", details: "نوبة دامت ٦ ساعات. تحسّن بعد الدواء والراحة." },
      { id: "v2", date: "٢٠٢٤/٠٢/١٢", reason: "تقييم صداع مزمن", summary: "MRI طبيعي", details: "تم استبعاد الأسباب العضوية. خطة وقاية بالبروبرانولول." },
    ],
    expectedRegions: ["head", "neck"],
    vitals: { hr: "٨٨", bp: "١٣٥/٨٥", temp: "٣٦.٨", rr: "١٦", spo2: "٩٨٪" },
  },
  {
    id: "case-004",
    category: "lower-back-pain",
    categoryLabel: "ألم أسفل الظهر",
    patient: { name: "سعد الحربي", age: 42, gender: "ذكر", mrn: "MRN-100945", avatarColor: "from-emerald-400 to-emerald-600" },
    chiefComplaint: "ألم أسفل الظهر ينتشر للساق اليمنى منذ ٣ أيام بعد رفع حمل ثقيل",
    pastMedicalHistory: ["انزلاق غضروفي L4-L5 ٢٠٢٢"],
    allergies: ["لا توجد"],
    chronicDiseases: ["لا توجد"],
    medications: ["إيبوبروفين عند الحاجة"],
    previousDiagnoses: ["عرق النسا"],
    visits: [
      { id: "v1", date: "٢٠٢٢/٠٦/٢٢", reason: "ألم ظهر حاد", summary: "MRI: انزلاق L4-L5", details: "علاج تحفظي بالأدوية والعلاج الطبيعي. تحسّن خلال ٦ أسابيع." },
    ],
    expectedRegions: ["lower-back", "leg-right", "buttocks"],
    vitals: { hr: "٨٢", bp: "١٢٨/٨٢", temp: "٣٦.٧", rr: "١٦", spo2: "٩٩٪" },
  },
  {
    id: "case-005",
    category: "shortness-of-breath",
    categoryLabel: "ضيق في التنفس",
    patient: { name: "فاطمة الزهراني", age: 67, gender: "أنثى", mrn: "MRN-101122", avatarColor: "from-sky-400 to-sky-600" },
    chiefComplaint: "ضيق نفس متزايد منذ يومين مع سعال وأزيز",
    pastMedicalHistory: ["ربو منذ الطفولة", "التهابات صدرية متكررة"],
    allergies: ["غبار الطلع", "الأسبرين"],
    chronicDiseases: ["الربو", "ارتفاع ضغط الدم"],
    medications: ["سالبوتامول بخاخ", "بوديزونيد بخاخ", "لوسارتان ٥٠ ملغ"],
    previousDiagnoses: ["ربو متوسط الشدة"],
    visits: [
      { id: "v1", date: "٢٠٢٤/٠٨/٣٠", reason: "نوبة ربو", summary: "PEFR منخفض، استجابت للنبيولايزر", details: "بقيت تحت الملاحظة ٤ ساعات. خرجت على بريدنيزون لمدة ٥ أيام." },
      { id: "v2", date: "٢٠٢٤/٠٤/١٢", reason: "متابعة الربو", summary: "السيطرة جيدة", details: "تعديل الخطة الوقائية. تدريب على استخدام البخاخات." },
    ],
    expectedRegions: ["chest", "neck"],
    vitals: { hr: "١٠٥", bp: "١٤٠/٨٨", temp: "٣٧.٤", rr: "٢٦", spo2: "٩٢٪" },
  },
];

export const SEVERITY_OPTIONS = [
  { value: "mild", label: "خفيف", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30" },
  { value: "moderate", label: "متوسط", color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30" },
  { value: "severe", label: "شديد", color: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30" },
] as const;

export const SYMPTOM_OPTIONS = [
  { value: "pain", label: "ألم" },
  { value: "tenderness", label: "إيلام عند اللمس" },
  { value: "swelling", label: "تورّم" },
  { value: "numbness", label: "تنميل" },
  { value: "burning", label: "حرقان" },
  { value: "pressure", label: "ضغط" },
] as const;

export type Severity = typeof SEVERITY_OPTIONS[number]["value"];
export type SymptomType = typeof SYMPTOM_OPTIONS[number]["value"];

export const REGION_LABELS: Record<BodyRegionId, string> = {
  head: "الرأس",
  neck: "الرقبة",
  chest: "الصدر",
  abdomen: "البطن",
  pelvis: "الحوض",
  "shoulder-left": "الكتف الأيسر",
  "shoulder-right": "الكتف الأيمن",
  "arm-left": "الذراع الأيسر",
  "arm-right": "الذراع الأيمن",
  "hand-left": "اليد اليسرى",
  "hand-right": "اليد اليمنى",
  "leg-left": "الساق اليسرى",
  "leg-right": "الساق اليمنى",
  "foot-left": "القدم اليسرى",
  "foot-right": "القدم اليمنى",
  "upper-back": "أعلى الظهر",
  "lower-back": "أسفل الظهر",
  buttocks: "الأرداف",
};
