import { MessageSquareText, Stethoscope, BrainCircuit, ListChecks } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export function HowItWorks() {
  const { t } = useI18n();
  const steps = [
    { icon: ListChecks, title: t("how.s1.title"), desc: t("how.s1.desc") },
    { icon: MessageSquareText, title: t("how.s2.title"), desc: t("how.s2.desc") },
    { icon: Stethoscope, title: t("how.s3.title"), desc: t("how.s3.desc") },
    { icon: BrainCircuit, title: t("how.s4.title"), desc: t("how.s4.desc") },
  ];

  return (
    <section id="how" className="relative py-28">
      <div className="absolute inset-x-0 top-1/2 -z-10 mx-auto h-72 max-w-4xl -translate-y-1/2 rounded-full bg-primary-glow/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            {t("how.eyebrow")}
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">{t("how.title")}</h2>
          <p className="mt-5 text-lg text-muted-foreground">{t("how.desc")}</p>
        </div>

        <div className="relative mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* connecting line on lg */}
          <div className="absolute inset-x-12 top-12 -z-10 hidden h-px bg-[linear-gradient(to_right,transparent,var(--color-primary)_30%,var(--color-primary)_70%,transparent)] opacity-30 lg:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group relative flex flex-col items-center rounded-3xl border border-border/60 bg-card/80 p-7 text-center shadow-[var(--shadow-card)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="relative mb-5">
                <div className="absolute inset-0 -z-10 rounded-3xl bg-[image:var(--gradient-primary)] opacity-20 blur-xl transition-opacity group-hover:opacity-40" />
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)] transition-transform duration-300 group-hover:scale-110">
                  <step.icon className="h-9 w-9" strokeWidth={1.8} />
                </div>
                <div className="absolute -bottom-2 -end-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-background text-xs font-extrabold text-primary shadow-[var(--shadow-soft)]">
                  {i + 1}
                </div>
              </div>
              <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
