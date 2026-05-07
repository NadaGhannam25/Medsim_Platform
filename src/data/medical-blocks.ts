// Medical system blocks for organizing clinical cases
import type { LearningCase } from "@/data/case-flow";

export type MedicalBlockId =
  | "gastrointestinal"
  | "respiratory"
  | "cardiovascular"
  | "neurological"
  | "infectious"
  | "endocrine"
  | "renal"
  | "musculoskeletal"
  | "obstetrics"
  | "pediatrics";

export type MedicalBlock = {
  id: MedicalBlockId;
  labelAr: string;
  labelEn: string;
  descAr: string;
  descEn: string;
  icon: string; // emoji
  color: string; // tailwind gradient classes
};

export const MEDICAL_BLOCKS: MedicalBlock[] = [
  {
    id: "gastrointestinal",
    labelAr: "بلوك الجهاز الهضمي",
    labelEn: "Gastrointestinal System Block",
    descAr: "ألم بطني، غثيان، قيء، إسهال، إمساك، يرقان",
    descEn: "Abdominal pain, nausea, vomiting, diarrhea, constipation, jaundice",
    icon: "🫁",
    color: "from-amber-400 to-amber-600",
  },
  {
    id: "respiratory",
    labelAr: "بلوك الجهاز التنفسي",
    labelEn: "Respiratory System Block",
    descAr: "ضيق نفس، سعال، أزيز، التهاب رئوي، ربو",
    descEn: "Shortness of breath, cough, wheezing, pneumonia, asthma",
    icon: "🌬️",
    color: "from-sky-400 to-sky-600",
  },
  {
    id: "cardiovascular",
    labelAr: "بلوك الجهاز القلبي الوعائي",
    labelEn: "Cardiovascular System Block",
    descAr: "ألم صدري قلبي، خفقان، ارتفاع ضغط، قصور قلب",
    descEn: "Cardiac chest pain, palpitations, hypertension, heart failure",
    icon: "❤️",
    color: "from-rose-400 to-rose-600",
  },
  {
    id: "neurological",
    labelAr: "بلوك الجهاز العصبي",
    labelEn: "Neurological System Block",
    descAr: "صداع، دوخة، نوبات صرع، ضعف، تنميل",
    descEn: "Headache, dizziness, seizures, weakness, numbness",
    icon: "🧠",
    color: "from-indigo-400 to-indigo-600",
  },
  {
    id: "infectious",
    labelAr: "بلوك الأمراض المعدية",
    labelEn: "Infectious Diseases Block",
    descAr: "حمى، عدوى، إنتان، التهاب سحايا",
    descEn: "Fever, infection, sepsis, meningitis",
    icon: "🦠",
    color: "from-teal-400 to-teal-600",
  },
  {
    id: "musculoskeletal",
    labelAr: "بلوك الجهاز العضلي الهيكلي",
    labelEn: "Musculoskeletal System Block",
    descAr: "ألم مفاصل، ألم ظهر، كسور، إصابات عضلية",
    descEn: "Joint pain, back pain, fractures, muscle/bone injuries",
    icon: "🦴",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    id: "obstetrics",
    labelAr: "بلوك النساء والتوليد",
    labelEn: "Obstetrics and Gynecology Block",
    descAr: "حالات متعلقة بالحمل، ألم حوضي، نزيف مهبلي",
    descEn: "Pregnancy-related cases, pelvic pain, vaginal bleeding",
    icon: "🤰",
    color: "from-pink-400 to-pink-600",
  },
  {
    id: "pediatrics",
    labelAr: "بلوك طب الأطفال",
    labelEn: "Pediatrics Block",
    descAr: "حالات سريرية خاصة بالأطفال",
    descEn: "Pediatric clinical cases",
    icon: "👶",
    color: "from-yellow-400 to-yellow-600",
  },
];

// Maps each case ID to a medical block
const CASE_BLOCK_MAP: Record<string, MedicalBlockId> = {
  "case-001": "cardiovascular",      // chest pain, cardiac
  "case-002": "gastrointestinal",     // abdominal pain, appendicitis
  "case-003": "neurological",         // headache, migraine
  "case-004": "musculoskeletal",      // lower back pain, sciatica
  "case-005": "respiratory",          // shortness of breath, asthma
  "case-006": "gastrointestinal",     // epigastric pain
  "case-007": "cardiovascular",       // headache with hypertension -> cardiovascular focus
  "case-008": "obstetrics",           // pregnancy-related abdominal pain
  "case-009": "pediatrics",           // child with fever and cough
  "case-010": "cardiovascular",       // palpitations
  "case-011": "musculoskeletal",      // hip fracture after fall
  "case-012": "infectious",           // fever, neck stiffness, meningitis suspicion
};

export function getCaseBlock(caseId: string): MedicalBlockId {
  return CASE_BLOCK_MAP[caseId] ?? "gastrointestinal";
}

export function getCasesByBlock(cases: LearningCase[]): Map<MedicalBlockId, LearningCase[]> {
  const map = new Map<MedicalBlockId, LearningCase[]>();
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
