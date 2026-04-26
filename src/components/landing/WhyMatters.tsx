import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function WhyMatters() {
  const { t } = useI18n();
  const points = [
    { title: t("why.p1.t"), desc: t("why.p1.d") },
    { title: t("why.p2.t"), desc: t("why.p2.d") },
    { title: t("why.p3.t"), desc: t("why.p3.d") },
    { title: t("why.p4.t"), desc: t("why.p4.d") },
  ];
  const aud = [t("why.aud.1"), t("why.aud.2"), t("why.aud.3")];

  return (
    <section id="why" className="py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            {t("why.eyebrow")}
          </div>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">{t("why.title")}</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t("why.desc")}</p>
          <div className="mt-8 grid gap-2">
            {aud.map((tx) => (
              <div key={tx} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {tx}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {points.map((p, i) => (
            <div
              key={p.title}
              className="flex gap-4 rounded-3xl border border-border/60 bg-card p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] font-extrabold text-primary-foreground shadow-[var(--shadow-soft)]">
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
