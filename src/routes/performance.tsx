import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/performance")({
  component: PerformancePage,
  head: () => ({ meta: [{ title: "تحليلات الأداء — مدسم" }] }),
});

function PerformancePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;

  return (
    <DashboardLayout>
      <Link to="/dashboard" className="mb-2 inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-bold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4 rotate-180" /> رجوع</Link>
      <h1 className="text-3xl font-black">تحليلات الأداء</h1>
      <p className="mt-2 text-muted-foreground">ملخص تعليمي يوضح دقة التشخيص، جودة المقابلة، واختيار الفحوصات.</p>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Metric icon={BarChart3} label="دقة التشخيص" value="٨١٪" progress={81} />
        <Metric icon={TrendingUp} label="قوة الفحص السريري" value="٨٤٪" progress={84} />
        <Metric icon={TrendingDown} label="تقليل الفحوصات غير الضرورية" value="٦٨٪" progress={68} />
      </div>
    </DashboardLayout>
  );
}

function Metric({ icon: Icon, label, value, progress }: { icon: typeof BarChart3; label: string; value: string; progress: number }) {
  return <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"><Icon className="mb-4 h-7 w-7 text-primary" /><div className="text-sm font-bold text-muted-foreground">{label}</div><div className="mt-1 text-3xl font-black">{value}</div><Progress value={progress} className="mt-4 h-2" /></div>;
}
