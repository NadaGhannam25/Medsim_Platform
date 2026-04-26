import { motion } from "framer-motion";
import { Sparkles, Stethoscope, BookOpen, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import heroImage from "@/assets/hero-medical.jpg";

export function Hero() {
  const { t, dir } = useI18n();
  const Arrow = dir === "rtl" ? "←" : "→";

  const stats = [
    { icon: BookOpen, num: t("stats.casesNum"), label: t("stats.cases") },
    { icon: Stethoscope, num: t("stats.specialtiesNum"), label: t("stats.specialties") },
    { icon: Users, num: t("stats.satisfactionNum"), label: t("stats.satisfaction") },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
      <div className="absolute -start-40 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -end-40 bottom-0 h-96 w-96 rounded-full bg-primary-glow/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              {t("hero.badge")}
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
              {t("hero.title.1")}
              <span className="mt-2 block bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
                {t("hero.title.2")}
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">{t("hero.desc")}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-full bg-[image:var(--gradient-primary)] px-7 text-base shadow-[var(--shadow-elegant)]">
                <Link to="/signup">
                  {t("hero.cta")}
                  <span className="mx-2">{Arrow}</span>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-primary/30 px-7 text-base">
                <Link to="/login">{t("nav.login")}</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[image:var(--gradient-soft)] shadow-[var(--shadow-elegant)]">
              <img
                src={heroImage}
                alt="Medsim AI clinical learning"
                width={1280}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -end-6 hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] md:block">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
                <div>
                  <div className="text-xs text-muted-foreground">{t("hero.virtualPatient")}</div>
                  <div className="text-sm font-semibold">{t("hero.session")}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid gap-4 sm:grid-cols-3"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="group flex items-center gap-5 rounded-3xl border border-border/60 bg-card/80 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]">
                <s.icon className="h-7 w-7" />
              </div>
              <div>
                <div className="bg-[image:var(--gradient-primary)] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl">
                  {s.num}
                </div>
                <div className="mt-1 text-sm font-medium text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
