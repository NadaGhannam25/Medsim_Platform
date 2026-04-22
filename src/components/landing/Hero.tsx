import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-medical.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-primary-glow/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            مدعوم بالذكاء الاصطناعي
          </div>
          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight md:text-6xl">
            تعلَّم الطب
            <span className="block bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
              من خلال مرضى افتراضيين
            </span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            منصّة تعليمية ذكية لطلاب العلوم الصحية. تفاعل مع حالات سريرية واقعية بالعربية،
            اطرح الأسئلة، اطلب الفحوصات، وضع تشخيصك — واحصل على تقييم تفصيلي يطوّر مهاراتك.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="bg-[image:var(--gradient-primary)] shadow-[var(--shadow-elegant)]">
              ابدأ أول حالة مجانًا
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary/30">
              <PlayCircle className="ml-2 h-4 w-4" />
              شاهد العرض التوضيحي
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground">
            <div><span className="font-bold text-foreground">+٢٠٠</span> حالة سريرية</div>
            <div className="h-4 w-px bg-border" />
            <div><span className="font-bold text-foreground">١٢</span> تخصصًا طبيًا</div>
            <div className="h-4 w-px bg-border" />
            <div><span className="font-bold text-foreground">٩٨٪</span> رضا الطلاب</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-elegant)]">
            <img
              src={heroImage}
              alt="طبيب يستخدم الذكاء الاصطناعي للتعلم السريري"
              width={1280}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] md:block">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
              <div>
                <div className="text-xs text-muted-foreground">المريض الافتراضي</div>
                <div className="text-sm font-semibold">جلسة نشطة الآن</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
