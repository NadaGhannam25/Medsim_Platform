import { CheckCircle2 } from "lucide-react";

const points = [
  { title: "جسر بين النظرية والتطبيق", desc: "حوّل ما تدرسه في الكتب إلى مهارات سريرية حقيقية يمكن قياسها." },
  { title: "تدرّب في أي وقت ومن أي مكان", desc: "لا حاجة للانتظار حتى المناوبة — تعلَّم بإيقاعك الخاص." },
  { title: "ثقة أكبر مع المرضى الحقيقيين", desc: "ابنِ تفكيرك السريري قبل دخول المستشفى لأول مرة." },
  { title: "استعداد قوي للامتحانات", desc: "حالات تحاكي امتحانات OSCE والـClinical Reasoning بشكل دقيق." },
];

export function WhyMatters() {
  return (
    <section id="why" className="py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">لماذا تهمّك هذه المنصة</div>
          <h2 className="text-3xl font-bold leading-tight md:text-4xl">
            لأن الطبيب الجيد لا يولد من الكتب وحدها
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            في كليات العلوم الصحية، الفجوة بين المعرفة النظرية والممارسة السريرية هي
            التحدّي الأكبر. منصّتنا تختصر هذه الفجوة بتدريب آمن وذكي يحاكي الواقع.
          </p>
          <div className="mt-8 grid gap-2">
            {[
              "طلاب الطب البشري وطب الأسنان",
              "طلاب التمريض والصيدلة السريرية",
              "طلاب العلاج الطبيعي والمختبرات الطبية",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {points.map((p, i) => (
            <div
              key={p.title}
              className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground font-bold">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="mb-1 font-bold">{p.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
