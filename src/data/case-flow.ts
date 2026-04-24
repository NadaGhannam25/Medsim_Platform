import { CLINICAL_CASES, type BodyRegionId, type ClinicalCase } from "@/data/clinical-cases";

export type CaseDifficulty = "مبتدئ" | "متوسط" | "متقدم";

export type InvestigationOption = {
  id: string;
  label: string;
  useful: boolean;
  explanation: string;
};

export type TreatmentOption = {
  id: string;
  label: string;
  correct: boolean;
  explanation: string;
};

export type LearningCase = ClinicalCase & {
  difficulty: CaseDifficulty;
  specialty: string;
  briefSummary: string;
  correctDiagnosis: string;
  diagnosisHints: Array<{ diagnosis: string; fit: string; supporting: string[]; missing: string }>;
  closeRegions: BodyRegionId[];
  investigations: InvestigationOption[];
  treatments: TreatmentOption[];
  mustAsk: string[];
  missedExamPoints: string[];
};

const sharedInvestigations = {
  cbc: { id: "cbc", label: "CBC" },
  glucose: { id: "glucose", label: "Blood glucose" },
  urine: { id: "urine", label: "Urine test" },
  xray: { id: "xray", label: "X-ray" },
  ct: { id: "ct", label: "CT scan" },
  mri: { id: "mri", label: "MRI" },
  ecg: { id: "ecg", label: "ECG" },
  ultrasound: { id: "ultrasound", label: "Ultrasound" },
};

const enrichments: Record<string, Omit<LearningCase, keyof ClinicalCase>> = {
  "case-001": {
    difficulty: "متقدم",
    specialty: "طب الطوارئ / القلب",
    briefSummary: "ألم صدري ضاغط مع عوامل خطورة قلبية يحتاج تمييزًا سريعًا بين أسباب قلبية وغير قلبية.",
    correctDiagnosis: "متلازمة الشريان التاجي الحادة",
    closeRegions: ["chest-right-upper", "chest-lower", "jaw", "forearm-left"],
    mustAsk: ["بداية الألم ومدته", "انتشار الألم", "أعراض مصاحبة مثل التعرق والغثيان", "عوامل الخطورة القلبية", "الأدوية والحساسية"],
    missedExamPoints: ["تقييم العلامات الحيوية", "فحص القلب والصدر", "البحث عن علامات فشل القلب"],
    diagnosisHints: [
      { diagnosis: "متلازمة شريان تاجي حادة", fit: "الألم ضاغط ومركزي وينتشر للذراع مع عوامل خطورة واضحة.", supporting: ["ألم صدري ضاغط", "انتشار للذراع", "سكري وضغط وكوليسترول"], missing: "تحتاج ECG وتروبونين لتأكيد الخطورة." },
      { diagnosis: "ارتجاع معدي مريئي", fit: "قد يسبب ألمًا صدريًا، لكنه أقل توافقًا مع الانتشار والتعرق.", supporting: ["ألم في منطقة الصدر"], missing: "لا توجد علاقة واضحة بالطعام أو حرقة نموذجية." },
      { diagnosis: "قلق / نوبة هلع", fit: "قد يسبب ألمًا وضيق نفس، لكنه لا يفسر عوامل الخطورة والانتشار جيدًا.", supporting: ["ضيق نفس خفيف"], missing: "لا توجد أعراض هلع واضحة ولا يجب استبعاد القلب أولًا." },
    ],
    investigations: [
      { ...sharedInvestigations.ecg, useful: true, explanation: "اختيار مهم جدًا لأنه يكشف تغيرات نقص التروية ويحدد الحاجة للتدخل العاجل." },
      { id: "troponin", label: "Troponin", useful: true, explanation: "يدعم تشخيص أذية عضلة القلب عند ارتفاعه مع القصة السريرية." },
      { ...sharedInvestigations.cbc, useful: true, explanation: "يفيد في تقييم فقر الدم أو العدوى كعوامل مرافقة، لكنه ليس الفحص الحاسم." },
      { ...sharedInvestigations.mri, useful: false, explanation: "MRI ليس فحصًا أوليًا لألم صدري حاد وقد يؤخر التدخل المهم." },
      { ...sharedInvestigations.ultrasound, useful: false, explanation: "ليس الفحص الأول لهذه القصة إلا إذا ظهرت دلائل على سبب بطني أو وعائي محدد." },
    ],
    treatments: [
      { id: "aspirin", label: "إعطاء أسبرين ومراقبة قلبية عاجلة", correct: true, explanation: "مناسب كخطوة تعليمية أولية عند الاشتباه بمتلازمة تاجية مع تقييم عاجل." },
      { id: "reassure", label: "طمأنة المريض فقط وإخراجه", correct: false, explanation: "خطر لأن الأعراض وعوامل الخطورة تستدعي تقييمًا قلبيًا عاجلًا." },
      { id: "antacid", label: "مضاد حموضة فقط", correct: false, explanation: "قد يكون مفيدًا لبعض الأسباب الهضمية، لكنه لا يغطي احتمالًا قلبيًا عالي الخطورة." },
    ],
  },
  "case-002": {
    difficulty: "متوسط",
    specialty: "الجراحة العامة",
    briefSummary: "ألم حاد في الربع السفلي الأيمن مع حرارة خفيفة، مناسب لتدريب توطين ألم البطن.",
    correctDiagnosis: "التهاب الزائدة الدودية الحاد",
    closeRegions: ["abdomen-umbilical", "suprapubic", "pelvis-right", "abdomen-ruq"],
    mustAsk: ["بداية الألم وهجرته", "فقدان الشهية والغثيان", "الحمى", "أعراض بولية أو نسائية", "آخر دورة شهرية إن لزم"],
    missedExamPoints: ["تحديد نقطة الألم في الربع السفلي الأيمن", "علامات التهيج البريتوني", "تقييم الحرارة والنبض"],
    diagnosisHints: [
      { diagnosis: "التهاب الزائدة", fit: "ألم RLQ مع حرارة وتسارع نبض يدعم التشخيص.", supporting: ["ألم يمين أسفل البطن", "حرارة", "غثيان محتمل"], missing: "CBC وتصوير مناسب عند الحاجة." },
      { diagnosis: "التهاب بولي", fit: "قد يسبب ألمًا سفليًا، لكن غياب الأعراض البولية يقلل الاحتمال.", supporting: ["ألم أسفل البطن"], missing: "حرقة بول أو تكرار بول ونتيجة تحليل بول." },
      { diagnosis: "مغص كلوي", fit: "قد يمتد للخاصرة، لكنه عادة موجي ويمتد للأربية.", supporting: ["ألم حاد"], missing: "بيلة دموية أو ألم خاصرة نموذجي." },
    ],
    investigations: [
      { ...sharedInvestigations.cbc, useful: true, explanation: "ارتفاع الكريات البيضاء يدعم وجود التهاب لكنه لا يكفي وحده للتشخيص." },
      { ...sharedInvestigations.ultrasound, useful: true, explanation: "مفيد خصوصًا لتقييم الزائدة واستبعاد أسباب نسائية في الحالات المناسبة." },
      { ...sharedInvestigations.urine, useful: true, explanation: "يفيد لاستبعاد التهاب بولي أو حصوات قد تتشابه سريريًا." },
      { ...sharedInvestigations.ecg, useful: false, explanation: "ليس مناسبًا كاختبار أولي لألم بطني سفلي عند مريضة شابة دون أعراض قلبية." },
      { ...sharedInvestigations.mri, useful: false, explanation: "ليس الخيار الأول عادةً في هذه المرحلة إلا في ظروف خاصة." },
    ],
    treatments: [
      { id: "surgical", label: "إحالة جراحية مع صيام ومسكنات مناسبة", correct: true, explanation: "منطقي عند الاشتباه بالزائدة مع مراقبة وتقييم جراحي." },
      { id: "laxative", label: "ملين وخروج للمنزل", correct: false, explanation: "قد يؤخر تشخيصًا جراحيًا مهمًا ولا يناسب وجود حرارة وألم موضع." },
      { id: "opioid-only", label: "مسكن قوي فقط دون تقييم", correct: false, explanation: "تسكين الألم لا يغني عن تقييم السبب واحتمال الحاجة لتدخل." },
    ],
  },
  "case-003": {
    difficulty: "متوسط",
    specialty: "طب الأعصاب",
    briefSummary: "صداع نابض موضع في الصدغ مع غثيان، يختبر دقة توطين أعراض الرأس والتمييز العصبي.",
    correctDiagnosis: "نوبة شقيقة",
    closeRegions: ["head-left-temporal", "head-right-frontal", "head-vertex", "neck-posterior"],
    mustAsk: ["نمط الصداع وشدته", "الهالة أو اضطراب الرؤية", "الغثيان والحساسية للضوء", "علامات الخطر العصبية", "الأدوية السابقة والاستجابة"],
    missedExamPoints: ["فحص عصبي مختصر", "فحص الرقبة", "قياس الضغط"],
    diagnosisHints: [
      { diagnosis: "شقيقة", fit: "صداع نابض أحادي الجانب مع غثيان وتاريخ سابق.", supporting: ["صداع نابض", "يمين الرأس", "غثيان", "تاريخ شقيقة"], missing: "تقييم علامات الخطر قبل الاكتفاء بالتشخيص." },
      { diagnosis: "نزف تحت العنكبوتية", fit: "يجب التفكير فيه إذا كان الصداع مفاجئًا جدًا وغير مسبوق.", supporting: ["صداع شديد"], missing: "بداية صاعقة، تيبس رقبة، اضطراب وعي." },
      { diagnosis: "صداع توتري", fit: "أشيع لكنه غالبًا ضاغط ثنائي وليس نابضًا مع غثيان واضح.", supporting: ["صداع"], missing: "غياب النمط الضاغط الثنائي." },
    ],
    investigations: [
      { ...sharedInvestigations.ct, useful: true, explanation: "مفيد إذا ظهرت علامات خطر أو صداع مفاجئ لاستبعاد نزف أو سبب خطير." },
      { ...sharedInvestigations.glucose, useful: true, explanation: "اختبار بسيط لاستبعاد اضطراب سكر قد يسبب أعراضًا عصبية أو عامة." },
      { ...sharedInvestigations.ecg, useful: false, explanation: "لا يجيب مباشرة عن صداع نموذجي دون أعراض قلبية." },
      { ...sharedInvestigations.xray, useful: false, explanation: "الأشعة السينية لا تفيد عادةً في تقييم الصداع النصفي." },
    ],
    treatments: [
      { id: "migraine-care", label: "راحة، سوائل، مضاد غثيان ومسكن/تريبتان عند الملاءمة", correct: true, explanation: "يناسب نوبة شقيقة مع مراعاة موانع الاستخدام والتقييم السريري." },
      { id: "antibiotic", label: "مضاد حيوي فوري", correct: false, explanation: "لا توجد مؤشرات عدوى واضحة أو التهاب سحايا في المعطيات الحالية." },
      { id: "ignore-redflags", label: "تجاهل علامات الخطر والاكتفاء بالمسكن", correct: false, explanation: "يجب دائمًا سؤال علامات الخطر قبل تثبيت تشخيص صداع حميد." },
    ],
  },
  "case-004": {
    difficulty: "مبتدئ",
    specialty: "العظام / الأعصاب",
    briefSummary: "ألم أسفل الظهر ينتشر للساق بعد حمل ثقيل، مناسب لتقييم عرق النسا والفحص العصبي.",
    correctDiagnosis: "عرق النسا بسبب تهيج جذور الأعصاب القطنية",
    closeRegions: ["lower-back-left", "sacral", "buttock-left", "thigh-left", "knee-right"],
    mustAsk: ["انتشار الألم للساق", "تنميل أو ضعف", "مشاكل بول أو براز", "حمى أو نقص وزن", "آلية الإصابة"],
    missedExamPoints: ["فحص القوة والإحساس", "اختبار رفع الساق المستقيمة", "البحث عن علامات ذيل الفرس"],
    diagnosisHints: [
      { diagnosis: "عرق النسا", fit: "ألم قطني ينتشر للطرف السفلي بعد رفع حمل.", supporting: ["ألم أسفل الظهر", "انتشار للساق اليمنى", "تاريخ انزلاق"], missing: "توثيق الفحص العصبي وعلامات الخطر." },
      { diagnosis: "شد عضلي قطني", fit: "ممكن بعد حمل ثقيل لكنه لا يفسر الانتشار العصبي جيدًا.", supporting: ["بداية بعد مجهود"], missing: "غياب الانتشار العصبي أو التنميل." },
      { diagnosis: "كسر فقري", fit: "أقل احتمالًا دون رض شديد أو هشاشة، لكنه مهم عند عوامل خطورة.", supporting: ["ألم ظهر"], missing: "رض قوي أو هشاشة أو ألم شديد مستمر." },
    ],
    investigations: [
      { ...sharedInvestigations.mri, useful: true, explanation: "مفيد عند وجود عجز عصبي أو استمرار الأعراض أو علامات خطر لتقييم الانزلاق." },
      { ...sharedInvestigations.xray, useful: true, explanation: "قد يفيد إذا وُجدت قصة رض أو شك بكسر، لكنه ليس دائمًا مطلوبًا في البداية." },
      { ...sharedInvestigations.urine, useful: false, explanation: "ليس أولويًا إذا كانت القصة ميكانيكية عصبية دون أعراض بولية." },
      { ...sharedInvestigations.ecg, useful: false, explanation: "لا علاقة مباشرة له بألم ظهر جذري نموذجي." },
    ],
    treatments: [
      { id: "conservative", label: "مسكنات مناسبة، حركة تدريجية، علاج طبيعي وتحذير من علامات الخطر", correct: true, explanation: "مناسب غالبًا كبداية عند غياب علامات الخطر أو عجز عصبي شديد." },
      { id: "bed-rest", label: "راحة تامة في السرير لمدة أسبوعين", correct: false, explanation: "الراحة الطويلة قد تؤخر التعافي؛ الحركة التدريجية أفضل غالبًا." },
      { id: "surgery-now", label: "جراحة فورية لكل ألم ظهر", correct: false, explanation: "الجراحة تُبحث عند عجز شديد أو فشل العلاج أو علامات خطيرة، وليست لكل حالة." },
    ],
  },
  "case-005": {
    difficulty: "متوسط",
    specialty: "الصدرية / الطوارئ",
    briefSummary: "ضيق نفس مع أزيز وتاريخ ربو، يركز على تقييم الجهاز التنفسي وخطورة نقص الأكسجة.",
    correctDiagnosis: "نوبة ربو حادة",
    closeRegions: ["chest-lower", "neck-anterior", "chest-central", "upper-back-left", "upper-back-right"],
    mustAsk: ["مدة ضيق النفس", "الأزيز والسعال", "المحفزات", "استخدام البخاخ", "دخول سابق للعناية أو تنبيب"],
    missedExamPoints: ["قياس SpO2", "سماع الصدر", "تقييم القدرة على الكلام", "علامات الإجهاد التنفسي"],
    diagnosisHints: [
      { diagnosis: "نوبة ربو", fit: "أزيز وضيق نفس مع تاريخ ربو واستجابة سابقة للموسعات.", supporting: ["أزيز", "ضيق نفس", "تاريخ ربو", "SpO2 منخفض نسبيًا"], missing: "PEFR أو تقييم شدة النوبة." },
      { diagnosis: "ذات رئة", fit: "السعال والحمى قد يدعمانها، لكن الأزيز وتاريخ الربو أقوى هنا.", supporting: ["سعال", "حرارة بسيطة"], missing: "حمى عالية أو بلغم قيحي أو علامات موضعية." },
      { diagnosis: "قصور قلب", fit: "ممكن عند كبار السن مع ضيق نفس لكنه أقل من الربو هنا.", supporting: ["العمر", "ضيق النفس"], missing: "وذمات، خراخر، تاريخ قلبي واضح." },
    ],
    investigations: [
      { id: "pefr", label: "Peak expiratory flow", useful: true, explanation: "يساعد في تقدير شدة نوبة الربو والاستجابة للعلاج." },
      { ...sharedInvestigations.xray, useful: true, explanation: "يفيد إذا وُجدت حرارة أو اشتباه بذات رئة أو مضاعفات." },
      { ...sharedInvestigations.cbc, useful: true, explanation: "قد يساعد عند الاشتباه بعدوى مرافقة، لكنه ليس محددًا للربو." },
      { ...sharedInvestigations.mri, useful: false, explanation: "غير مناسب لتقييم نوبة ربو حادة ولا يضيف قيمة أولية." },
      { ...sharedInvestigations.urine, useful: false, explanation: "لا يرتبط مباشرة بضيق النفس والأزيز في هذه القصة." },
    ],
    treatments: [
      { id: "bronchodilator", label: "أكسجين عند الحاجة + سالبوتامول متكرر + ستيرويد حسب الشدة", correct: true, explanation: "يعالج التضيق القصبي ويقلل الالتهاب مع مراقبة الاستجابة." },
      { id: "sedative", label: "مهدئ لتقليل القلق فقط", correct: false, explanation: "قد يفاقم تثبيط التنفس ولا يعالج السبب الأساسي." },
      { id: "antibiotic-only", label: "مضاد حيوي فقط", correct: false, explanation: "لا يعالج التشنج القصبي ولا يُستخدم وحده دون دلائل عدوى واضحة." },
    ],
  },
};

const generatedCases: ClinicalCase[] = [
  {
    id: "case-006",
    category: "abdominal-pain",
    categoryLabel: "ألم بطني علوي",
    patient: { name: "ليان القحطاني", age: 31, gender: "أنثى", mrn: "MRN-101488", avatarColor: "from-cyan-400 to-cyan-600" },
    chiefComplaint: "ألم حارق أعلى البطن بعد الوجبات مع غثيان خفيف",
    pastMedicalHistory: ["التهاب معدة سابق"],
    allergies: ["لا توجد"],
    chronicDiseases: ["لا توجد"],
    medications: ["إيبوبروفين متكرر لآلام الدورة"],
    previousDiagnoses: ["عسر هضم وظيفي"],
    visits: [{ id: "v1", date: "٢٠٢٤/١٠/٠٧", reason: "ألم معدة", summary: "تحسن مؤقت على PPI", details: "نُصحت بتجنب NSAIDs والوجبات الثقيلة ومراجعة إذا ظهرت علامات إنذار." }],
    expectedRegions: ["abdomen-epigastric", "chest-lower"],
    vitals: { hr: "٨٦", bp: "١١٢/٧٢", temp: "٣٦.٩", rr: "١٦", spo2: "٩٩٪" },
  },
  {
    id: "case-007",
    category: "headache",
    categoryLabel: "دوخة وصداع",
    patient: { name: "ماجد السبيعي", age: 60, gender: "ذكر", mrn: "MRN-101733", avatarColor: "from-violet-400 to-violet-600" },
    chiefComplaint: "صداع خلفي مع دوخة وارتفاع ضغط منذ يوم",
    pastMedicalHistory: ["زيارات متقطعة لارتفاع ضغط"],
    allergies: ["لا توجد"],
    chronicDiseases: ["ارتفاع ضغط الدم"],
    medications: ["لوسارتان غير منتظم"],
    previousDiagnoses: ["ضغط غير مضبوط"],
    visits: [{ id: "v1", date: "٢٠٢٤/٠٩/١٤", reason: "ارتفاع ضغط", summary: "BP 165/95", details: "نُصح بالالتزام بالعلاج وقياس الضغط منزليًا." }],
    expectedRegions: ["head-occipital", "neck-posterior"],
    vitals: { hr: "٩٤", bp: "١٧٢/١٠٢", temp: "٣٦.٨", rr: "١٨", spo2: "٩٨٪" },
  },
];

const generatedEnrichments: Record<string, Omit<LearningCase, keyof ClinicalCase>> = {
  "case-006": {
    difficulty: "مبتدئ",
    specialty: "الباطنية / الجهاز الهضمي",
    briefSummary: "ألم شرسوفي بعد الوجبات مع استخدام NSAIDs، مناسب لتدريب التفريق بين أسباب ألم أعلى البطن.",
    correctDiagnosis: "التهاب المعدة / عسر هضم مرتبط بمضادات الالتهاب",
    closeRegions: ["abdomen-ruq", "abdomen-luq", "abdomen-umbilical"],
    mustAsk: ["علاقة الألم بالطعام", "استخدام NSAIDs", "قيء دموي أو براز أسود", "نقص وزن", "الحموضة والارتجاع"],
    missedExamPoints: ["فحص شرسوفي موضع", "علامات نزف أو جفاف", "تقييم علامات الإنذار"],
    diagnosisHints: [
      { diagnosis: "التهاب معدة", fit: "ألم شرسوفي مع NSAIDs وتحسن سابق على PPI.", supporting: ["ألم أعلى البطن", "بعد الوجبات", "إيبوبروفين متكرر"], missing: "علامات إنذار أو فحص جرثومة المعدة عند اللزوم." },
      { diagnosis: "مرارة", fit: "قد تسبب ألمًا بعد الطعام، لكن المكان والوصف أقل نموذجية.", supporting: ["بعد الوجبات"], missing: "ألم RUQ أو انتشار للكتف الأيمن." },
    ],
    investigations: [
      { id: "h-pylori", label: "H. pylori test", useful: true, explanation: "مفيد في ألم شرسوفي متكرر لتوجيه العلاج." },
      { ...sharedInvestigations.cbc, useful: true, explanation: "يساعد في تقييم فقر دم أو نزف مزمن عند وجود مؤشرات." },
      { ...sharedInvestigations.ecg, useful: false, explanation: "ليس أوليًا إذا كانت القصة هضمية واضحة دون ألم صدري أو عوامل خطورة." },
      { ...sharedInvestigations.mri, useful: false, explanation: "لا يقدم قيمة أولية في هذه الصورة السريرية." },
    ],
    treatments: [
      { id: "ppi", label: "إيقاف NSAIDs غير الضرورية + PPI وتعليمات علامات الإنذار", correct: true, explanation: "يعالج السبب المرجح ويحدد متى يحتاج المريض مراجعة عاجلة." },
      { id: "antibiotic-random", label: "مضاد حيوي عشوائي", correct: false, explanation: "لا يُعطى دون دليل عدوى أو خطة علاج جرثومة مؤكدة." },
    ],
  },
  "case-007": {
    difficulty: "متقدم",
    specialty: "الباطنية / الأعصاب",
    briefSummary: "صداع خلفي مع ضغط مرتفع، يركز على تقييم شدة ارتفاع الضغط وعلامات الخطر العصبية.",
    correctDiagnosis: "ارتفاع ضغط غير مضبوط مع صداع يحتاج تقييم علامات الخطورة",
    closeRegions: ["head-vertex", "head-right-frontal", "head-left-frontal", "neck-posterior"],
    mustAsk: ["أعراض عصبية بؤرية", "ألم صدر أو ضيق نفس", "التزام علاج الضغط", "تشوش رؤية", "بداية الصداع"],
    missedExamPoints: ["فحص عصبي", "إعادة قياس الضغط", "فحص قاع العين عند اللزوم"],
    diagnosisHints: [
      { diagnosis: "ارتفاع ضغط غير مضبوط", fit: "ضغط مرتفع مع صداع والتزام ضعيف بالعلاج.", supporting: ["BP 172/102", "صداع خلفي", "عدم انتظام الدواء"], missing: "دلائل أذية أعضاء مستهدفة لتحديد الطارئ." },
      { diagnosis: "سكتة دماغية", fit: "يجب استبعادها إذا ظهرت علامات عصبية.", supporting: ["دوخة وصداع"], missing: "ضعف طرف، اضطراب كلام، فقدان توازن شديد." },
    ],
    investigations: [
      { ...sharedInvestigations.glucose, useful: true, explanation: "اختبار سريع مهم في أعراض عصبية/دوخة لاستبعاد اضطراب السكر." },
      { ...sharedInvestigations.ct, useful: true, explanation: "يناسب إذا وُجدت علامات عصبية أو صداع شديد جديد لاستبعاد نزف/سكتة." },
      { ...sharedInvestigations.urine, useful: true, explanation: "قد يساعد في تقييم تأثر الكلى أو بروتين/دم مع ارتفاع الضغط." },
      { ...sharedInvestigations.xray, useful: false, explanation: "لا يفسر الصداع أو ارتفاع الضغط مباشرة." },
    ],
    treatments: [
      { id: "bp-plan", label: "تقييم أذية الأعضاء، ضبط الضغط تدريجيًا وتعزيز الالتزام", correct: true, explanation: "آمن تعليميًا لأن الخفض السريع دون استطباب قد يكون ضارًا." },
      { id: "rapid-drop", label: "خفض الضغط بسرعة شديدة لكل الحالات", correct: false, explanation: "الخفض السريع لا يناسب كل الحالات وقد يسبب نقص تروية إذا لم توجد حالة إسعافية محددة." },
    ],
  },
};

export const LEARNING_CASES: LearningCase[] = [
  ...CLINICAL_CASES.map((clinicalCase) => ({ ...clinicalCase, ...enrichments[clinicalCase.id] })),
  ...generatedCases.map((clinicalCase) => ({ ...clinicalCase, ...generatedEnrichments[clinicalCase.id] })),
];

export const INITIAL_CASE_IDS = ["case-001", "case-002", "case-003", "case-004", "case-005"];

export function getLearningCase(caseId: string) {
  return LEARNING_CASES.find((item) => item.id === caseId);
}
