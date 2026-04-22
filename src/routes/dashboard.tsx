import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, BookOpenCheck, Trophy, Target, TrendingUp,
  TrendingDown, Sparkles, Clock, ChevronLeft
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "لوحة التحكم — طبيبك الافتراضي" }] }),
});

const strengths = [
  { area: "أمراض القلب", score: 92 },
  { area: "الجهاز التنفسي", score: 87 },
  { area: "الفحص السريري", score: 84 },
];

const weaknesses = [
  { area: "أمراض الغدد الصماء", score: 52 },
  { area: "تفسير صور الأشعة", score: 58 },
  { area: "أمراض الدم", score: 61 },
];

const recentCases = [
  { id: 1, title: "ألم صدري حاد لدى رجل ٥٥ عامًا", specialty: "أمراض القلب", score: 88, date: "منذ ساعتين", status: "completed" },
  { id: 2, title: "ضيق تنفس مزمن لدى مدخّن", specialty: "الجهاز التنفسي", score: 76, date: "أمس", status: "completed" },
  { id: 3, title: "صداع متكرر مع غثيان", specialty: "طب الأعصاب", score: 0, date: "قيد التنفيذ", status: "in-progress" },
  { id: 4, title: "ارتفاع سكر الدم لدى مراهق", specialty: "الغدد الصماء", score: 64, date: "منذ ٣ أيام", status: "completed" },
];

function DashboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const name = user.user_metadata?.full_name?.split(" ")[0] || "طالب";

  return (
    <DashboardLayout>
      {/* Welcome card */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-[image:var(--gradient-primary)] p-8 text-primary-foreground shadow-[var(--shadow-elegant)]">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              المستوى الحالي: متقدّم
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">أهلًا د. {name} 👋</h1>
            <p className="mt-2 text-primary-foreground/85">
              لديك مريض جديد ينتظر التشخيص. هل أنت مستعد للتحدّي؟
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => toast.info("سيتم إطلاق محرّك الحالات قريبًا")}
            className="bg-white text-primary shadow-lg hover:bg-white/90"
          >
            ابدأ حالة جديدة
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpenCheck} label="حالات مكتملة" value="٤٢" hint="+٦ هذا الأسبوع" tone="primary" />
        <StatCard icon={Trophy} label="المستوى الحالي" value="متقدّم" hint="٧٢٪ نحو الخبير" tone="amber" />
        <StatCard icon={Target} label="دقّة التشخيص" value="٨١٪" hint="+٤٪ هذا الشهر" tone="emerald" />
        <StatCard icon={Clock} label="ساعات تدريب" value="٢٨س" hint="هذا الشهر" tone="blue" />
      </div>

      {/* Progress to next level */}
      <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold">تقدّمك نحو المستوى التالي</h3>
            <p className="text-sm text-muted-foreground">٢٨ حالة متبقية للوصول إلى مستوى "خبير سريري"</p>
          </div>
          <span className="text-2xl font-bold text-primary">٧٢٪</span>
        </div>
        <Progress value={72} className="h-2" />
      </div>

      {/* Strengths & weaknesses */}
      <div className="mb-8 grid gap-5 lg:grid-cols-2">
        <InsightCard
          title="نقاط قوّتك"
          subtitle="استمرّ بهذا الأداء الممتاز"
          icon={TrendingUp}
          tone="emerald"
          items={strengths}
        />
        <InsightCard
          title="مجالات تحتاج تطويرًا"
          subtitle="اقترحنا لك حالات لتقوية هذه المجالات"
          icon={TrendingDown}
          tone="rose"
          items={weaknesses}
        />
      </div>

      {/* Recent cases */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold">الحالات الأخيرة</h3>
            <p className="text-sm text-muted-foreground">آخر التدريبات السريرية التي قمت بها</p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            عرض الكل
            <ChevronLeft className="mr-1 h-4 w-4" />
          </Button>
        </div>
        <div className="divide-y divide-border">
          {recentCases.map((c) => (
            <div key={c.id} className="flex items-center gap-4 py-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpenCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{c.title}</div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{c.specialty}</span>
                  <span>•</span>
                  <span>{c.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {c.status === "completed" ? (
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">النتيجة</div>
                    <div className={`text-lg font-bold ${c.score >= 80 ? "text-emerald-600" : c.score >= 65 ? "text-amber-600" : "text-rose-600"}`}>
                      {c.score}٪
                    </div>
                  </div>
                ) : (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    قيد التنفيذ
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, label, value, hint, tone }: {
  icon: typeof Trophy; label: string; value: string; hint: string;
  tone: "primary" | "amber" | "emerald" | "blue";
}) {
  const toneClasses = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-sky-100 text-sky-700",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function InsightCard({ title, subtitle, icon: Icon, tone, items }: {
  title: string; subtitle: string; icon: typeof TrendingUp;
  tone: "emerald" | "rose"; items: { area: string; score: number }[];
}) {
  const toneClasses = tone === "emerald"
    ? { bg: "bg-emerald-100", text: "text-emerald-700", bar: "bg-emerald-500" }
    : { bg: "bg-rose-100", text: "text-rose-700", bar: "bg-rose-500" };
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="mb-5 flex items-start gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses.bg} ${toneClasses.text}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.area}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium">{item.area}</span>
              <span className={`font-bold ${toneClasses.text}`}>{item.score}٪</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className={`h-full rounded-full ${toneClasses.bar} transition-all`} style={{ width: `${item.score}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
