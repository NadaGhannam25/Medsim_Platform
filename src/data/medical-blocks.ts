// Medical system blocks for organizing clinical cases
import type { LearningCase } from "@/data/case-flow";
import gastrointestinalImg from "@/assets/blocks/gastrointestinal.png";
import respiratoryImg from "@/assets/blocks/respiratory.png";
import cardiovascularImg from "@/assets/blocks/cardiovascular.png";
import neurologicalImg from "@/assets/blocks/neurological.png";
import musculoskeletalImg from "@/assets/blocks/musculoskeletal.png";
import pediatricsImg from "@/assets/blocks/pediatrics.png";
import emergencyImg from "@/assets/blocks/emergency.png";
import dermatologyImg from "@/assets/blocks/dermatology.png";
import entImg from "@/assets/blocks/ent.png";
import ophthalmologyImg from "@/assets/blocks/ophthalmology.png";

export type MedicalBlockId =
  | "gastrointestinal"
  | "respiratory"
  | "cardiovascular"
  | "neurological"
  | "musculoskeletal"
  | "pediatrics"
  | "emergency"
  | "dermatology"
  | "ent"
  | "ophthalmology";

export type MedicalBlock = {
  id: MedicalBlockId;
  labelAr: string;
  labelEn: string;
  descAr: string;
  descEn: string;
  examplesAr: string[];
  examplesEn: string[];
  image: string;
  color: string;
};

export const MEDICAL_BLOCKS: MedicalBlock[] = [
  {
    id: "gastrointestinal",
    labelAr: "بلوك الجهاز الهضمي",
    labelEn: "Gastrointestinal Block",
    descAr: "اضطرابات وأمراض الجهاز الهضمي",
    descEn: "Gastrointestinal disorders and diseases",
    examplesAr: ["ألم بطني", "غثيان وقيء", "إسهال", "إمساك", "نزيف هضمي", "يرقان", "التهاب الزائدة", "التهاب المرارة"],
    examplesEn: ["Abdominal pain", "Nausea/vomiting", "Diarrhea", "Constipation", "GI bleed", "Jaundice", "Appendicitis", "Cholecystitis"],
    image: gastrointestinalImg,
    color: "from-amber-400 to-amber-600",
  },
  {
    id: "respiratory",
    labelAr: "بلوك الجهاز التنفسي",
    labelEn: "Respiratory Block",
    descAr: "اضطرابات الجهاز التنفسي والرئتين",
    descEn: "Respiratory and pulmonary disorders",
    examplesAr: ["ضيق نفس", "سعال", "أزيز", "التهاب رئوي", "ربو", "استرواح صدر", "انسداد رئوي"],
    examplesEn: ["Dyspnea", "Cough", "Wheeze", "Pneumonia", "Asthma", "Pneumothorax", "PE"],
    image: respiratoryImg,
    color: "from-sky-400 to-sky-600",
  },
  {
    id: "cardiovascular",
    labelAr: "بلوك الجهاز القلبي الوعائي",
    labelEn: "Cardiovascular Block",
    descAr: "أمراض القلب والأوعية الدموية",
    descEn: "Heart and vascular diseases",
    examplesAr: ["ألم صدري قلبي", "خفقان", "ارتفاع ضغط", "انخفاض ضغط", "قصور قلب", "ذبحة صدرية", "جلطة قلبية"],
    examplesEn: ["Cardiac chest pain", "Palpitations", "Hypertension", "Hypotension", "Heart failure", "Angina", "MI"],
    image: cardiovascularImg,
    color: "from-rose-400 to-rose-600",
  },
  {
    id: "neurological",
    labelAr: "بلوك الجهاز العصبي",
    labelEn: "Neurological Block",
    descAr: "اضطرابات الدماغ والأعصاب",
    descEn: "Brain and nervous system disorders",
    examplesAr: ["صداع", "دوخة", "تشنجات", "ضعف أو خدر", "فقدان وعي", "سكتة دماغية", "ألم عصبي"],
    examplesEn: ["Headache", "Dizziness", "Seizures", "Weakness/numbness", "Loss of consciousness", "Stroke", "Neuralgia"],
    image: neurologicalImg,
    color: "from-indigo-400 to-indigo-600",
  },
  {
    id: "musculoskeletal",
    labelAr: "بلوك الجهاز العضلي الهيكلي",
    labelEn: "Musculoskeletal Block",
    descAr: "إصابات وأمراض العظام والمفاصل والعضلات",
    descEn: "Bone, joint, and muscle disorders",
    examplesAr: ["ألم مفاصل", "ألم ظهر", "كسور", "إصابات عضلية", "التواء", "ألم رقبة", "ألم كتف أو ركبة"],
    examplesEn: ["Joint pain", "Back pain", "Fractures", "Muscle injuries", "Sprain", "Neck pain", "Shoulder/knee pain"],
    image: musculoskeletalImg,
    color: "from-emerald-400 to-emerald-600",
  },
  {
    id: "pediatrics",
    labelAr: "بلوك الأطفال",
    labelEn: "Pediatrics Block",
    descAr: "حالات سريرية خاصة بالأطفال",
    descEn: "Pediatric clinical cases",
    examplesAr: ["حمى عند الأطفال", "سعال", "ألم بطني", "قيء وإسهال", "طفح جلدي", "صعوبة تنفس"],
    examplesEn: ["Pediatric fever", "Cough", "Abdominal pain", "Vomiting/diarrhea", "Rash", "Respiratory distress"],
    image: pediatricsImg,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: "emergency",
    labelAr: "بلوك الطوارئ",
    labelEn: "Emergency Block",
    descAr: "حالات إسعافية تحتاج قرار عاجل",
    descEn: "Emergency cases requiring urgent decisions",
    examplesAr: ["ألم صدري حاد", "صدمة", "فقدان وعي", "نزيف حاد", "ضيق نفس شديد", "إصابة أو حادث"],
    examplesEn: ["Acute chest pain", "Shock", "Loss of consciousness", "Severe bleeding", "Severe dyspnea", "Trauma"],
    image: emergencyImg,
    color: "from-orange-400 to-orange-600",
  },
  {
    id: "dermatology",
    labelAr: "بلوك الجلدية",
    labelEn: "Dermatology Block",
    descAr: "أمراض ومشاكل الجلد",
    descEn: "Skin diseases and conditions",
    examplesAr: ["طفح جلدي", "حكة", "التهاب جلدي", "حساسية جلدية", "عدوى جلدية", "تورم أو احمرار"],
    examplesEn: ["Rash", "Itching", "Dermatitis", "Skin allergy", "Skin infection", "Swelling/redness"],
    image: dermatologyImg,
    color: "from-pink-400 to-pink-600",
  },
  {
    id: "ent",
    labelAr: "بلوك الأنف والأذن والحنجرة",
    labelEn: "ENT Block",
    descAr: "أمراض الأنف والأذن والحنجرة",
    descEn: "Ear, nose, and throat disorders",
    examplesAr: ["التهاب حلق", "ألم أذن", "دوخة دهليزية", "انسداد أنف", "التهاب جيوب", "فقدان سمع"],
    examplesEn: ["Sore throat", "Ear pain", "Vestibular vertigo", "Nasal congestion", "Sinusitis", "Hearing loss"],
    image: entImg,
    color: "from-teal-400 to-teal-600",
  },
  {
    id: "ophthalmology",
    labelAr: "بلوك العيون",
    labelEn: "Ophthalmology Block",
    descAr: "أمراض وإصابات العين",
    descEn: "Eye diseases and injuries",
    examplesAr: ["ألم عين", "احمرار العين", "ضعف النظر", "إفرازات العين", "إصابة العين"],
    examplesEn: ["Eye pain", "Red eye", "Vision loss", "Eye discharge", "Eye injury"],
    image: ophthalmologyImg,
    color: "from-fuchsia-400 to-fuchsia-600",
  },
];

// Maps each case ID to a medical block
const CASE_BLOCK_MAP: Record<string, MedicalBlockId> = {
  // Original 12
  "case-001": "cardiovascular",
  "case-002": "gastrointestinal",
  "case-003": "neurological",
  "case-004": "musculoskeletal",
  "case-005": "respiratory",
  "case-006": "gastrointestinal",
  "case-007": "cardiovascular",
  "case-008": "gastrointestinal",
  "case-009": "pediatrics",
  "case-010": "cardiovascular",
  "case-011": "musculoskeletal",
  "case-012": "neurological",
  // GI
  "case-013": "gastrointestinal",
  "case-014": "gastrointestinal",
  "case-015": "gastrointestinal",
  "case-016": "gastrointestinal",
  "case-017": "gastrointestinal",
  // Respiratory
  "case-018": "respiratory",
  "case-019": "respiratory",
  "case-020": "respiratory",
  "case-021": "respiratory",
  "case-022": "respiratory",
  // Cardiovascular
  "case-023": "cardiovascular",
  "case-024": "cardiovascular",
  "case-025": "cardiovascular",
  // Neurological
  "case-026": "neurological",
  "case-027": "neurological",
  "case-028": "neurological",
  "case-029": "neurological",
  "case-030": "neurological",
  // Musculoskeletal
  "case-031": "musculoskeletal",
  "case-032": "musculoskeletal",
  "case-033": "musculoskeletal",
  "case-034": "musculoskeletal",
  // Pediatrics
  "case-035": "pediatrics",
  "case-036": "pediatrics",
  "case-037": "pediatrics",
  "case-038": "pediatrics",
  // Emergency
  "case-039": "emergency",
  "case-040": "emergency",
  "case-041": "emergency",
  "case-042": "emergency",
  "case-043": "emergency",
  // Dermatology
  "case-044": "dermatology",
  "case-045": "dermatology",
  "case-046": "dermatology",
  "case-047": "dermatology",
  // ENT
  "case-048": "ent",
  "case-049": "ent",
  "case-050": "ent",
  "case-051": "ent",
  // Ophthalmology
  "case-052": "ophthalmology",
  "case-053": "ophthalmology",
  "case-054": "ophthalmology",
};

export function getCaseBlock(caseId: string): MedicalBlockId {
  return CASE_BLOCK_MAP[caseId] ?? "emergency";
}

export function getCasesByBlock(cases: LearningCase[]): Map<MedicalBlockId, LearningCase[]> {
  const map = new Map<MedicalBlockId, LearningCase[]>();
  for (const block of MEDICAL_BLOCKS) map.set(block.id, []);
  for (const c of cases) {
    const blockId = getCaseBlock(c.id);
    if (!map.has(blockId)) map.set(blockId, []);
    map.get(blockId)!.push(c);
  }
  return map;
}

export function getBlockById(id: MedicalBlockId): MedicalBlock | undefined {
  return MEDICAL_BLOCKS.find((b) => b.id === id);
}
