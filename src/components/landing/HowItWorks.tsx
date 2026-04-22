import { MessageSquareText, ClipboardList, Stethoscope, BrainCircuit } from "lucide-react";

const steps = [
  {
    icon: MessageSquareText,
    title: "تحدّث مع المريض",
    desc: "ابدأ المقابلة السريرية مع مريض افتراضي يستجيب بالعربية بشكل واقعي وذكي.",
  },
  {
    icon: ClipboardList,
    title: "اجمع التاريخ المرضي",
    desc: "اطرح الأسئلة المناسبة، دوّن الأعراض، وحدّد العوامل المؤثرة على الحالة.",
  },
  {
    icon: Stethoscope,
    title: "اطلب الفحوصات",
    desc: "اختر الفحص السريري والتحاليل المخبرية والصور الإشعاعية اللازمة للتشخيص.",
  },
  {
    icon: BrainCircuit,
    title: "احصل على التقييم",
    desc: "قدّم تشخيصك واستلم تقريرًا تفصيليًا بنقاط القوة ومجالات التطوير.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">آلية العمل</div>
          <h2 className="text-3xl font-bold md:text-4xl">رحلة سريرية متكاملة في أربع خطوات</h2>
          <p className="mt-4 text-muted-foreground">
            تحاكي المنصة بيئة العيادة الحقيقية لتمنحك تدريبًا عمليًا قبل التطبيق على المرضى.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group relative rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground">
                {i + 1}
              </div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
