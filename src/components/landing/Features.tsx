import { Bot, BarChart3, BookOpenCheck, ShieldCheck, Layers, Languages } from "lucide-react";

const features = [
  { icon: Bot, title: "مرضى افتراضيون أذكياء", desc: "محادثات طبيعية بالعربية الفصحى مع شخصيات مرضى متنوعة الأعمار والحالات." },
  { icon: BarChart3, title: "تحليل أداء شخصي", desc: "لوحة تتبّع نقاط قوتك وتكشف الفجوات المعرفية في كل تخصص." },
  { icon: Layers, title: "حالات تتكيّف معك", desc: "خوارزمية ذكية تختار الحالات التالية بناءً على مستواك واحتياجاتك." },
  { icon: BookOpenCheck, title: "مرجعية علمية موثوقة", desc: "كل التشخيصات والإرشادات مبنية على المراجع الطبية المعتمدة عالميًا." },
  { icon: Languages, title: "محتوى عربي أصيل", desc: "مصطلحات طبية دقيقة ومترجمة بعناية لتدعم الطالب العربي في رحلته." },
  { icon: ShieldCheck, title: "بيئة آمنة للتعلم", desc: "تدرّب وتخطئ دون أي مخاطر — كل خطأ هنا هو خطوة نحو إتقان أعمق." },
];

export function Features() {
  return (
    <section id="features" className="bg-[image:var(--gradient-soft)] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">المميزات</div>
          <h2 className="text-3xl font-bold md:text-4xl">أدوات صُمِّمت خصيصًا للطالب الطبي</h2>
          <p className="mt-4 text-muted-foreground">
            كل ما تحتاجه لتطوير تفكيرك السريري في منصة واحدة متكاملة.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border/60 bg-card/80 p-7 backdrop-blur-sm transition hover:border-primary/30 hover:shadow-[var(--shadow-card)]"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
