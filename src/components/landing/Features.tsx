import { Bot, BarChart3, BookOpenCheck, ShieldCheck, Layers, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Features() {
  const { t } = useI18n();
  const features = [
    { icon: Bot, t: t("features.f1.t"), d: t("features.f1.d") },
    { icon: BarChart3, t: t("features.f2.t"), d: t("features.f2.d") },
    { icon: Layers, t: t("features.f3.t"), d: t("features.f3.d") },
    { icon: BookOpenCheck, t: t("features.f4.t"), d: t("features.f4.d") },
    { icon: Sparkles, t: t("features.f5.t"), d: t("features.f5.d") },
    { icon: ShieldCheck, t: t("features.f6.t"), d: t("features.f6.d") },
  ];

  return (
    <section id="features" className="bg-[image:var(--gradient-soft)] py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            {t("features.eyebrow")}
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">{t("features.title")}</h2>
          <p className="mt-5 text-lg text-muted-foreground">{t("features.desc")}</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.t}
              className="group rounded-3xl border border-border/60 bg-card/80 p-7 backdrop-blur-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-card)]"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)] transition-transform group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-bold">{f.t}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
