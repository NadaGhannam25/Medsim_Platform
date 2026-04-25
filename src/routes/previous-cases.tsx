import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, BookOpenCheck, ChevronLeft } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/previous-cases")({
  component: PreviousCasesPage,
  head: () => ({ meta: [{ title: "حالاتي السابقة — مدسم" }] }),
});

const rows = [
  { title: "ألم صدري حاد", date: "اليوم", score: "٨٨٪", status: "مكتملة" },
  { title: "صداع نابض مع غثيان", date: "أمس", score: "٧٦٪", status: "مكتملة" },
  { title: "ألم أسفل الظهر", date: "منذ ٣ أيام", score: "قيد التقييم", status: "قيد التنفيذ" },
];

function PreviousCasesPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <Link to="/dashboard" className="mb-2 inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-bold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4 rotate-180" /> رجوع</Link>
          <h1 className="text-3xl font-black">حالاتي السابقة</h1>
          <p className="mt-2 text-muted-foreground">راجع نتائجك وتقدمك في الحالات التي أنهيتها أو بدأتها.</p>
        </div>
        <Button asChild className="gap-2 bg-[image:var(--gradient-primary)]"><Link to="/clinical-cases">ابدأ حالة جديدة <ChevronLeft className="h-4 w-4" /></Link></Button>
      </div>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="divide-y divide-border">
          {rows.map((row) => <div key={row.title} className="flex flex-wrap items-center gap-4 py-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><BookOpenCheck className="h-5 w-5" /></div><div className="flex-1"><div className="font-black">{row.title}</div><div className="text-sm text-muted-foreground">{row.date} · {row.status}</div></div><div className="text-xl font-black text-primary">{row.score}</div></div>)}
        </div>
      </div>
    </DashboardLayout>
  );
}
