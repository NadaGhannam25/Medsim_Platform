// Hidden per-case checklist + manual-request investigation catalog.
// The student never sees the keyword arrays — they're matched silently against
// what the student types in the interview / investigation request fields.

export type ChecklistCategory = "history" | "exam" | "investigations" | "diagnosis" | "treatment";

export const CATEGORY_LABELS: Record<ChecklistCategory, string> = {
  history: "التاريخ المرضي",
  exam: "الفحص السريري",
  investigations: "الفحوصات",
  diagnosis: "التشخيص",
  treatment: "الخطة العلاجية",
};

export type ChecklistItem = {
  id: string;
  category: ChecklistCategory;
  label: string; // shown only at end-of-case feedback
  keywords: string[]; // any match (normalized substring) marks the item complete
};

export type LabRow = { name: string; value: string; range: string; flag?: "high" | "low" | "normal" };

export type InvestigationResult =
  | { kind: "lab"; title: string; rows: LabRow[]; interpretation: string }
  | { kind: "imaging"; title: string; modality: string; impression: string; notes: string }
  | { kind: "ecg"; title: string; rhythm: string; rate: string; impression: string; notes: string };

export type InvestigationEntry = {
  id: string;
  label: string; // Arabic display name
  aliases: string[]; // Arabic/English terms the student might type
  useful: boolean; // whether it's clinically appropriate for this case
  rationale: string; // shown after request
  result: InvestigationResult;
};

export type CaseChecklistData = {
  checklist: ChecklistItem[];
  investigationCatalog: InvestigationEntry[];
  expectedDiagnosisKeywords: string[]; // for scoring final diagnosis
  expectedTreatmentKeywords: string[]; // for scoring management plan
};

const N = (s: string) =>
  s.toLowerCase().trim().replace(/[\u064B-\u065F]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");

export function matchesAny(text: string, keywords: string[]): boolean {
  const t = N(text);
  return keywords.some((k) => t.includes(N(k)));
}

// ============== CASE-SPECIFIC DATA ==============

export const CASE_CHECKLIST_DATA: Record<string, CaseChecklistData> = {
  // CASE 001 — Acute coronary syndrome
  "case-001": {
    expectedDiagnosisKeywords: ["تاجي", "احتشاء", "ذبحه", "قلبي", "نقص ترويه", "acs", "mi"],
    expectedTreatmentKeywords: ["اسبرين", "aspirin", "ecg", "تروبونين", "قسطره", "نيتروجلسرين", "تقييم قلبي"],
    checklist: [
      { id: "h1", category: "history", label: "سؤال عن مدة الألم وبدايته", keywords: ["متى", "بدا", "مده", "كم ساعه", "كم دقيقه"] },
      { id: "h2", category: "history", label: "سؤال عن انتشار الألم", keywords: ["انتشار", "ينتشر", "ذراع", "فك", "كتف", "ظهر"] },
      { id: "h3", category: "history", label: "سؤال عن أعراض مصاحبة (تعرق/غثيان)", keywords: ["تعرق", "غثيان", "قي", "ضيق نفس", "خفقان"] },
      { id: "h4", category: "history", label: "سؤال عن عوامل خطورة قلبية", keywords: ["تدخين", "سكر", "ضغط", "كوليسترول", "تاريخ عائلي"] },
      { id: "h5", category: "history", label: "سؤال عن الأدوية والحساسية", keywords: ["دواء", "ادويه", "حساسيه"] },
      { id: "e1", category: "exam", label: "تحديد منطقة الصدر المركزية", keywords: ["chest-central", "chest-right-upper", "chest-left-upper"] },
      { id: "e2", category: "exam", label: "تقييم العلامات الحيوية", keywords: ["علامات حيويه", "ضغط", "نبض", "اكسجين", "spo2"] },
      { id: "i1", category: "investigations", label: "طلب ECG", keywords: ["ecg"] },
      { id: "i2", category: "investigations", label: "طلب Troponin", keywords: ["troponin"] },
      { id: "d1", category: "diagnosis", label: "تشخيص متلازمة تاجية", keywords: ["تاجي", "احتشاء", "ذبحه", "acs", "mi"] },
      { id: "t1", category: "treatment", label: "خطة قلبية مناسبة", keywords: ["اسبرين", "aspirin", "تقييم قلبي", "قسطره"] },
    ],
    investigationCatalog: [
      {
        id: "ecg", label: "تخطيط القلب ECG", aliases: ["ecg", "تخطيط قلب", "رسم قلب", "كهربيه قلب"],
        useful: true, rationale: "فحص أساسي لتحديد نقص التروية أو احتشاء حاد.",
        result: { kind: "ecg", title: "ECG — 12 lead", rhythm: "Sinus rhythm", rate: "92 bpm",
          impression: "ST-segment depression in leads V4–V6 مع تبدلات T",
          notes: "تظهر الصورة علامات تدعم نقص ترويه — قراره اكلينيكيه عاجله مطلوبه." },
      },
      {
        id: "troponin", label: "Troponin", aliases: ["troponin", "تروبونين"],
        useful: true, rationale: "علامة لإصابة عضلة القلب.",
        result: { kind: "lab", title: "Cardiac Troponin I", interpretation: "ارتفاع التروبونين يدعم وجود اذيه عضله القلب",
          rows: [{ name: "Troponin I", value: "0.92 ng/mL", range: "<0.04", flag: "high" }] },
      },
      {
        id: "cbc", label: "تحليل دم شامل CBC", aliases: ["cbc", "تحليل دم", "صوره دم"],
        useful: true, rationale: "تقييم فقر دم أو علامات عدوى مرافقة.",
        result: { kind: "lab", title: "CBC", interpretation: "نتائج ضمن الحدود الطبيعيه تقريبا",
          rows: [
            { name: "WBC", value: "8.4", range: "4–11", flag: "normal" },
            { name: "Hb", value: "13.6", range: "13–17", flag: "normal" },
            { name: "Platelets", value: "245", range: "150–400", flag: "normal" },
          ] },
      },
      {
        id: "cxr", label: "أشعة الصدر", aliases: ["اشعه صدر", "اشعه على الصدر", "chest x-ray", "cxr", "xray صدر"],
        useful: true, rationale: "لاستبعاد احتقان رئوي أو أسباب أخرى لألم الصدر.",
        result: { kind: "imaging", title: "Chest X-ray PA", modality: "X-ray",
          impression: "حجم القلب طبيعي. لا يوجد احتقان رئوي واضح.",
          notes: "لا توجد علامات خطيره واضحه على الصوره." },
      },
      {
        id: "mri", label: "MRI", aliases: ["mri", "رنين"],
        useful: false, rationale: "ليس فحصا اوليا لالم صدري حاد وقد يؤخر التدخل.",
        result: { kind: "imaging", title: "Cardiac MRI", modality: "MRI", impression: "غير مناسب كاختبار اولي.",
          notes: "هذا الفحص قد يؤخر التدخل العاجل في حالات الالم الصدري الحاد." },
      },
    ],
  },

  // CASE 002 — Appendicitis
  "case-002": {
    expectedDiagnosisKeywords: ["زائده", "appendicitis", "appendix"],
    expectedTreatmentKeywords: ["جراح", "صيام", "مسكن", "سوائل", "مضاد حيوي"],
    checklist: [
      { id: "h1", category: "history", label: "سؤال عن مكان الألم بدقة", keywords: ["وين", "اين", "مكان", "موضع"] },
      { id: "h2", category: "history", label: "سؤال عن هجرة الألم", keywords: ["هجره", "تنقل", "سره", "بدا فوق"] },
      { id: "h3", category: "history", label: "سؤال عن غثيان أو قيء", keywords: ["غثيان", "قي", "ترجيع"] },
      { id: "h4", category: "history", label: "سؤال عن الحمى", keywords: ["حراره", "حمى", "سخونه"] },
      { id: "h5", category: "history", label: "سؤال عن أعراض بولية", keywords: ["بول", "حرقه", "تكرار بول"] },
      { id: "h6", category: "history", label: "سؤال عن الدورة الشهرية", keywords: ["دوره", "حيض"] },
      { id: "e1", category: "exam", label: "تحديد الربع السفلي الأيمن", keywords: ["abdomen-rlq", "pelvis-right"] },
      { id: "i1", category: "investigations", label: "طلب CBC", keywords: ["cbc", "تحليل دم"] },
      { id: "i2", category: "investigations", label: "طلب Ultrasound", keywords: ["ultrasound", "سونار", "موجات صوتيه", "اشعه صوتيه"] },
      { id: "i3", category: "investigations", label: "طلب تحليل بول", keywords: ["تحليل بول", "urine"] },
      { id: "d1", category: "diagnosis", label: "تشخيص التهاب الزائدة", keywords: ["زائده", "appendicitis"] },
      { id: "t1", category: "treatment", label: "خطة جراحية مناسبة", keywords: ["جراح", "صيام", "احاله جراحيه"] },
    ],
    investigationCatalog: [
      {
        id: "cbc", label: "CBC", aliases: ["cbc", "تحليل دم", "صوره دم"],
        useful: true, rationale: "ارتفاع الكريات البيضاء يدعم وجود التهاب.",
        result: { kind: "lab", title: "CBC", interpretation: "ارتفاع كريات الدم البيضاء قد يدعم وجود التهاب",
          rows: [
            { name: "WBC", value: "14.2", range: "4–11", flag: "high" },
            { name: "Neutrophils %", value: "82", range: "40–70", flag: "high" },
            { name: "Hb", value: "13.1", range: "12–16", flag: "normal" },
            { name: "Platelets", value: "280", range: "150–400", flag: "normal" },
          ] },
      },
      {
        id: "ultrasound", label: "أشعة موجات صوتية للبطن", aliases: ["ultrasound", "سونار", "موجات صوتيه", "اشعه صوتيه على البطن"],
        useful: true, rationale: "مفيد لتقييم الزائدة وأسباب نسائية.",
        result: { kind: "imaging", title: "Abdominal Ultrasound", modality: "Ultrasound",
          impression: "زائده دوديه متضخمه (>7mm) مع حساسيه موضعيه عند الضغط.",
          notes: "تظهر الصوره علامات تدعم التشخيص." },
      },
      {
        id: "urine", label: "تحليل بول", aliases: ["تحليل بول", "urine"],
        useful: true, rationale: "لاستبعاد التهاب بولي.",
        result: { kind: "lab", title: "Urinalysis", interpretation: "نتائج طبيعيه — التهاب بولي مستبعد",
          rows: [
            { name: "WBC/HPF", value: "2", range: "0–5", flag: "normal" },
            { name: "Nitrites", value: "Negative", range: "Negative", flag: "normal" },
            { name: "RBC/HPF", value: "1", range: "0–3", flag: "normal" },
          ] },
      },
      {
        id: "ecg", label: "ECG", aliases: ["ecg", "تخطيط قلب", "رسم قلب"],
        useful: false, rationale: "ليس مناسبا لالم بطني سفلي عند مريضه شابه دون اعراض قلبيه.",
        result: { kind: "ecg", title: "ECG", rhythm: "Normal sinus", rate: "78", impression: "طبيعي",
          notes: "لا يضيف قيمه تشخيصيه في هذه الحاله." },
      },
      {
        id: "ct", label: "CT scan للبطن", aliases: ["ct", "اشعه مقطعيه", "مقطعيه"],
        useful: true, rationale: "مفيد عند الشك بمضاعفات أو غموض التشخيص.",
        result: { kind: "imaging", title: "CT Abdomen", modality: "CT",
          impression: "زائده متضخمه مع شحوم محيطه ملتهبه — صورة تتفق مع التهاب الزائدة.",
          notes: "تظهر الصوره علامات تدعم التشخيص." },
      },
    ],
  },

  // CASE 003 — Migraine
  "case-003": {
    expectedDiagnosisKeywords: ["شقيقه", "صداع نصفي", "migraine"],
    expectedTreatmentKeywords: ["تريبتان", "مسكن", "مضاد غثيان", "راحه", "سوائل"],
    checklist: [
      { id: "h1", category: "history", label: "سؤال عن نمط الصداع", keywords: ["نابض", "ضاغط", "نوع الصداع", "صفه"] },
      { id: "h2", category: "history", label: "سؤال عن الهالة أو الرؤية", keywords: ["هاله", "رويه", "رؤيه", "ضوء"] },
      { id: "h3", category: "history", label: "سؤال عن الغثيان", keywords: ["غثيان", "قي"] },
      { id: "h4", category: "history", label: "سؤال عن علامات الخطر العصبية", keywords: ["ضعف", "تنميل", "كلام", "وعي", "تشنج"] },
      { id: "e1", category: "exam", label: "توطين الصداع في الصدغ/الرأس", keywords: ["head-right-temporal", "head-left-temporal", "head-right-frontal", "head-left-frontal"] },
      { id: "i1", category: "investigations", label: "اعتبار CT عند علامات الخطر", keywords: ["ct", "اشعه مقطعيه", "مقطعيه"] },
      { id: "d1", category: "diagnosis", label: "تشخيص الشقيقة", keywords: ["شقيقه", "migraine", "صداع نصفي"] },
      { id: "t1", category: "treatment", label: "خطة علاج شقيقة مناسبة", keywords: ["تريبتان", "مسكن", "راحه"] },
    ],
    investigationCatalog: [
      {
        id: "ct", label: "CT للرأس", aliases: ["ct", "اشعه مقطعيه", "مقطعيه راس"],
        useful: true, rationale: "لاستبعاد نزف عند علامات الخطر.",
        result: { kind: "imaging", title: "CT Brain", modality: "CT",
          impression: "لا يوجد نزف داخل القحف. لا توجد كتل أو وذمه.",
          notes: "لا توجد علامات خطيره واضحه على الصوره." },
      },
      {
        id: "glucose", label: "سكر دم", aliases: ["سكر", "glucose", "rbs"],
        useful: true, rationale: "لاستبعاد اضطراب سكر يسبب اعراضا عامه.",
        result: { kind: "lab", title: "Random Blood Glucose", interpretation: "ضمن المعدل الطبيعي",
          rows: [{ name: "RBS", value: "108 mg/dL", range: "70–140", flag: "normal" }] },
      },
      {
        id: "ecg", label: "ECG", aliases: ["ecg", "تخطيط قلب"],
        useful: false, rationale: "لا يجيب عن صداع دون اعراض قلبيه.",
        result: { kind: "ecg", title: "ECG", rhythm: "Sinus", rate: "76", impression: "طبيعي",
          notes: "غير مرتبط بشكوى الصداع الحالية." },
      },
      {
        id: "xray", label: "أشعة سينية", aliases: ["اشعه سينيه", "x-ray", "xray"],
        useful: false, rationale: "لا تفيد عاده في الصداع.",
        result: { kind: "imaging", title: "Skull X-ray", modality: "X-ray", impression: "طبيعي",
          notes: "هذه الصوره لا تضيف قيمه تشخيصيه في الصداع النصفي." },
      },
    ],
  },

  // CASE 004 — Sciatica
  "case-004": {
    expectedDiagnosisKeywords: ["عرق النسا", "انزلاق", "جذور", "sciatica", "disc"],
    expectedTreatmentKeywords: ["مسكن", "علاج طبيعي", "حركه تدريجيه", "تحفظي"],
    checklist: [
      { id: "h1", category: "history", label: "سؤال عن انتشار الألم للساق", keywords: ["انتشار", "ساق", "رجل", "ينزل"] },
      { id: "h2", category: "history", label: "سؤال عن تنميل أو ضعف", keywords: ["تنميل", "ضعف", "خدر"] },
      { id: "h3", category: "history", label: "سؤال عن مشاكل بول/براز (ذيل الفرس)", keywords: ["بول", "براز", "تحكم"] },
      { id: "h4", category: "history", label: "سؤال عن آلية الإصابة", keywords: ["كيف بدا", "حمل", "رفع", "اصابه"] },
      { id: "e1", category: "exam", label: "توطين أسفل الظهر/الورك/الفخذ", keywords: ["lower-back-left", "lower-back-right", "buttock-left", "buttock-right", "thigh-left", "thigh-right", "sacral"] },
      { id: "i1", category: "investigations", label: "اعتبار MRI عند العجز/استمرار الأعراض", keywords: ["mri", "رنين"] },
      { id: "d1", category: "diagnosis", label: "تشخيص عرق النسا", keywords: ["عرق النسا", "انزلاق", "sciatica"] },
      { id: "t1", category: "treatment", label: "خطة تحفظية مناسبة", keywords: ["تحفظي", "علاج طبيعي", "مسكن", "حركه"] },
    ],
    investigationCatalog: [
      {
        id: "mri", label: "MRI للعمود القطني", aliases: ["mri", "رنين"],
        useful: true, rationale: "لتقييم الانزلاق الغضروفي وضغط الجذور.",
        result: { kind: "imaging", title: "MRI Lumbar Spine", modality: "MRI",
          impression: "انزلاق غضروفي L4–L5 مع ضغط على جذر العصب L5 الأيسر.",
          notes: "تظهر الصوره علامات تدعم التشخيص — يحتاج ربط بالفحص العصبي." },
      },
      {
        id: "xray", label: "أشعة على العمود القطني", aliases: ["xray", "اشعه سينيه", "x-ray", "اشعه على الظهر"],
        useful: true, rationale: "قد يفيد للبحث عن كسر عند قصة رض.",
        result: { kind: "imaging", title: "Lumbar X-ray", modality: "X-ray",
          impression: "محاذاه طبيعيه. لا يوجد كسر واضح.",
          notes: "لا توجد علامات خطيره واضحه." },
      },
      {
        id: "urine", label: "تحليل بول", aliases: ["تحليل بول", "urine"],
        useful: false, rationale: "ليس اولويا في قصه ميكانيكيه عصبيه.",
        result: { kind: "lab", title: "Urinalysis", interpretation: "طبيعي",
          rows: [{ name: "WBC/HPF", value: "1", range: "0–5", flag: "normal" }] },
      },
      {
        id: "ecg", label: "ECG", aliases: ["ecg", "تخطيط قلب"],
        useful: false, rationale: "لا علاقه له بالم ظهر جذري.",
        result: { kind: "ecg", title: "ECG", rhythm: "Sinus", rate: "72", impression: "طبيعي", notes: "غير مرتبط." },
      },
    ],
  },

  // CASE 005 — Asthma exacerbation
  "case-005": {
    expectedDiagnosisKeywords: ["ربو", "نوبه ربو", "asthma"],
    expectedTreatmentKeywords: ["سالبوتامول", "موسع", "ستيرويد", "اكسجين", "بخاخ"],
    checklist: [
      { id: "h1", category: "history", label: "سؤال عن مدة ضيق النفس", keywords: ["متى", "كم ساعه", "مده"] },
      { id: "h2", category: "history", label: "سؤال عن الأزيز والسعال", keywords: ["ازيز", "صفير", "سعال", "كحه"] },
      { id: "h3", category: "history", label: "سؤال عن المحفزات", keywords: ["محفز", "غبار", "حساسيه", "موسم", "تمرين"] },
      { id: "h4", category: "history", label: "سؤال عن استخدام البخاخ", keywords: ["بخاخ", "ventolin", "سالبوتامول"] },
      { id: "h5", category: "history", label: "سؤال عن دخول العناية سابقا", keywords: ["عنايه", "تنبيب", "دخول مستشفى"] },
      { id: "e1", category: "exam", label: "توطين الصدر/الرقبة", keywords: ["chest-lower", "chest-central", "neck-anterior", "upper-back-left", "upper-back-right"] },
      { id: "i1", category: "investigations", label: "طلب PEFR", keywords: ["pefr", "peak flow", "تدفق"] },
      { id: "i2", category: "investigations", label: "طلب أشعة الصدر إذا لزم", keywords: ["اشعه صدر", "cxr", "chest x-ray"] },
      { id: "d1", category: "diagnosis", label: "تشخيص نوبة ربو", keywords: ["ربو", "asthma"] },
      { id: "t1", category: "treatment", label: "موسع قصبي + ستيرويد", keywords: ["سالبوتامول", "موسع", "ستيرويد", "اكسجين"] },
    ],
    investigationCatalog: [
      {
        id: "pefr", label: "Peak Expiratory Flow", aliases: ["pefr", "peak flow", "تدفق الزفير"],
        useful: true, rationale: "يقيّم شدة النوبة والاستجابة للعلاج.",
        result: { kind: "lab", title: "PEFR", interpretation: "انخفاض ملحوظ يدعم نوبه ربو متوسطه/شديده",
          rows: [{ name: "PEFR", value: "210 L/min", range: "predicted 450", flag: "low" }] },
      },
      {
        id: "cxr", label: "أشعة الصدر", aliases: ["اشعه صدر", "cxr", "chest x-ray", "xray صدر"],
        useful: true, rationale: "لاستبعاد ذات رئة أو مضاعفات.",
        result: { kind: "imaging", title: "Chest X-ray", modality: "X-ray",
          impression: "تضخم رئوي خفيف بدون ارتشاحات. لا يوجد استرواح صدر.",
          notes: "توجد ملاحظه تحتاج ربطها بالاعراض." },
      },
      {
        id: "cbc", label: "CBC", aliases: ["cbc", "تحليل دم"],
        useful: true, rationale: "قد يساعد عند الشك بعدوى مرافقة.",
        result: { kind: "lab", title: "CBC", interpretation: "ارتفاع طفيف في الحمضات يتفق مع خلفيه ارجيه",
          rows: [
            { name: "WBC", value: "9.8", range: "4–11", flag: "normal" },
            { name: "Eosinophils %", value: "7", range: "1–4", flag: "high" },
          ] },
      },
      {
        id: "mri", label: "MRI", aliases: ["mri", "رنين"],
        useful: false, rationale: "غير مناسب لتقييم نوبه ربو حاده.",
        result: { kind: "imaging", title: "Chest MRI", modality: "MRI", impression: "غير مناسب اوليا.",
          notes: "لا يضيف قيمه في تقييم نوبة ربو حاده." },
      },
    ],
  },

  // CASE 006 — Gastritis
  "case-006": {
    expectedDiagnosisKeywords: ["معده", "التهاب معده", "عسر هضم", "gastritis"],
    expectedTreatmentKeywords: ["ppi", "اوميبرازول", "ايقاف nsaid", "تعليمات"],
    checklist: [
      { id: "h1", category: "history", label: "علاقة الألم بالطعام", keywords: ["طعام", "اكل", "وجبه"] },
      { id: "h2", category: "history", label: "استخدام مضادات الالتهاب", keywords: ["nsaid", "ايبوبروفين", "بروفين", "مسكنات"] },
      { id: "h3", category: "history", label: "علامات نزف هضمي", keywords: ["دم", "براز اسود", "قي دموي", "ميلينا"] },
      { id: "e1", category: "exam", label: "فحص شرسوفي", keywords: ["abdomen-epigastric"] },
      { id: "i1", category: "investigations", label: "اختبار جرثومة المعدة", keywords: ["h. pylori", "h pylori", "جرثومه معده", "هيليكوباكتر"] },
      { id: "d1", category: "diagnosis", label: "تشخيص التهاب المعدة/عسر هضم", keywords: ["معده", "gastritis", "عسر هضم"] },
      { id: "t1", category: "treatment", label: "PPI وإيقاف NSAID", keywords: ["ppi", "اوميبرازول", "ايقاف nsaid"] },
    ],
    investigationCatalog: [
      {
        id: "h-pylori", label: "اختبار جرثومة المعدة", aliases: ["h. pylori", "h pylori", "جرثومه معده", "هيليكوباكتر"],
        useful: true, rationale: "يوجّه العلاج عند ألم شرسوفي متكرر.",
        result: { kind: "lab", title: "H. pylori Stool Antigen", interpretation: "ايجابي — يدعم العلاج الثلاثي للجرثومه",
          rows: [{ name: "H. pylori Ag", value: "Positive", range: "Negative", flag: "high" }] },
      },
      {
        id: "cbc", label: "CBC", aliases: ["cbc", "تحليل دم"],
        useful: true, rationale: "لتقييم فقر دم أو نزف مزمن.",
        result: { kind: "lab", title: "CBC", interpretation: "طبيعي تقريبا",
          rows: [
            { name: "Hb", value: "12.4", range: "12–16", flag: "normal" },
            { name: "MCV", value: "82", range: "80–96", flag: "normal" },
          ] },
      },
      {
        id: "ecg", label: "ECG", aliases: ["ecg", "تخطيط قلب"],
        useful: false, rationale: "ليس اوليا في قصه هضميه واضحه.",
        result: { kind: "ecg", title: "ECG", rhythm: "Sinus", rate: "74", impression: "طبيعي", notes: "غير مرتبط." },
      },
    ],
  },

  // CASE 007 — Uncontrolled HTN
  "case-007": {
    expectedDiagnosisKeywords: ["ضغط", "ارتفاع ضغط", "htn", "hypertension"],
    expectedTreatmentKeywords: ["ضبط ضغط", "التزام", "تقييم اعضاء", "خفض تدريجي"],
    checklist: [
      { id: "h1", category: "history", label: "سؤال عن أعراض عصبية بؤرية", keywords: ["ضعف", "تنميل", "كلام", "رؤيه"] },
      { id: "h2", category: "history", label: "ألم صدر/ضيق نفس", keywords: ["الم صدر", "ضيق نفس"] },
      { id: "h3", category: "history", label: "الالتزام بعلاج الضغط", keywords: ["دواء", "التزام", "لوسارتان"] },
      { id: "e1", category: "exam", label: "توطين الرأس/الرقبة", keywords: ["head-occipital", "neck-posterior", "head-vertex"] },
      { id: "i1", category: "investigations", label: "تحليل بول لتقييم الكلى", keywords: ["تحليل بول", "urine"] },
      { id: "i2", category: "investigations", label: "اعتبار CT عند علامات الخطر", keywords: ["ct", "مقطعيه"] },
      { id: "d1", category: "diagnosis", label: "تشخيص ارتفاع ضغط غير مضبوط", keywords: ["ضغط", "htn", "hypertension"] },
      { id: "t1", category: "treatment", label: "ضبط تدريجي وتعزيز الالتزام", keywords: ["ضبط ضغط", "التزام", "تدريجي"] },
    ],
    investigationCatalog: [
      {
        id: "ct", label: "CT للرأس", aliases: ["ct", "مقطعيه", "اشعه مقطعيه"],
        useful: true, rationale: "لاستبعاد نزف عند علامات الخطر.",
        result: { kind: "imaging", title: "CT Brain", modality: "CT", impression: "لا يوجد نزف داخل القحف.",
          notes: "لا توجد علامات خطيره واضحه." },
      },
      {
        id: "urine", label: "تحليل بول", aliases: ["تحليل بول", "urine"],
        useful: true, rationale: "لتقييم تأثر الكلى وبروتين/دم.",
        result: { kind: "lab", title: "Urinalysis", interpretation: "بروتين خفيف يتفق مع تأثر كلوي مبكر",
          rows: [
            { name: "Protein", value: "1+", range: "Negative", flag: "high" },
            { name: "RBC/HPF", value: "2", range: "0–3", flag: "normal" },
          ] },
      },
      {
        id: "glucose", label: "سكر دم", aliases: ["سكر", "glucose", "rbs"],
        useful: true, rationale: "لاستبعاد سبب اضافي للاعراض.",
        result: { kind: "lab", title: "RBS", interpretation: "ضمن الطبيعي",
          rows: [{ name: "RBS", value: "118 mg/dL", range: "70–140", flag: "normal" }] },
      },
      {
        id: "xray", label: "أشعة سينية", aliases: ["xray", "x-ray", "اشعه سينيه"],
        useful: false, rationale: "لا تفسّر الصداع أو ارتفاع الضغط.",
        result: { kind: "imaging", title: "X-ray", modality: "X-ray", impression: "غير مرتبط.",
          notes: "لا يضيف قيمه تشخيصيه." },
      },
    ],
  },
};

const FALLBACK_CHECKLIST: CaseChecklistData = {
  expectedDiagnosisKeywords: [],
  expectedTreatmentKeywords: ["علاج داعم", "متابعه", "تثقيف"],
  checklist: [
    { id: "fb-h1", category: "history", label: "بداية الأعراض ومدتها", keywords: ["متى", "بدا", "مده", "كم يوم", "كم ساعه"] },
    { id: "fb-h2", category: "history", label: "الأعراض المصاحبة", keywords: ["مع", "مصاحب", "غثيان", "حمى", "تعب"] },
    { id: "fb-h3", category: "history", label: "الأدوية والحساسية", keywords: ["دواء", "ادويه", "حساسيه"] },
    { id: "fb-e1", category: "exam", label: "تقييم العلامات الحيوية", keywords: ["علامات حيويه", "ضغط", "نبض", "حراره"] },
    { id: "fb-i1", category: "investigations", label: "طلب فحص أساسي مناسب", keywords: ["cbc", "تحليل", "اشعه", "فحص"] },
    { id: "fb-d1", category: "diagnosis", label: "صياغة تشخيص متوقع", keywords: ["تشخيص"] },
    { id: "fb-t1", category: "treatment", label: "خطة علاجية أو متابعة", keywords: ["علاج", "متابعه", "تحويل"] },
  ],
  investigationCatalog: [
    {
      id: "cbc", label: "تحليل دم شامل CBC", aliases: ["cbc", "تحليل دم", "صوره دم"],
      useful: true, rationale: "تقييم عام مفيد في معظم الحالات.",
      result: { kind: "lab", title: "CBC", interpretation: "ضمن الطبيعي تقريبًا",
        rows: [
          { name: "WBC", value: "8.2", range: "4–11", flag: "normal" },
          { name: "Hb", value: "13.5", range: "12–16", flag: "normal" },
          { name: "Platelets", value: "240", range: "150–400", flag: "normal" },
        ] },
    },
    {
      id: "urine", label: "تحليل بول", aliases: ["urine", "تحليل بول"],
      useful: true, rationale: "مفيد لاستبعاد عدوى بولية أو مشاكل كلوية.",
      result: { kind: "lab", title: "Urinalysis", interpretation: "ضمن الطبيعي",
        rows: [{ name: "Protein", value: "Negative", range: "Negative", flag: "normal" }] },
    },
  ],
};

export function getCaseChecklistData(caseId: string): CaseChecklistData {
  return CASE_CHECKLIST_DATA[caseId] ?? FALLBACK_CHECKLIST;
}

