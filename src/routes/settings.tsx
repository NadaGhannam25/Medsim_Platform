import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, Bell, Shield, User2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "الإعدادات — طبيبك الافتراضي" }] }),
});

function SettingsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;

  return (
    <DashboardLayout>
      <Link to="/dashboard" className="mb-2 inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-bold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4 rotate-180" /> رجوع</Link>
      <h1 className="text-3xl font-black">الإعدادات</h1>
      <p className="mt-2 text-muted-foreground">إعدادات الحساب وتجربة التعلم والتنبيهات.</p>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"><h2 className="mb-4 flex items-center gap-2 text-xl font-black"><User2 className="h-5 w-5 text-primary" /> بيانات الطالب</h2><div className="space-y-4"><div><Label>الاسم</Label><Input className="mt-2" defaultValue={user.user_metadata?.full_name || "طالب طب"} /></div><div><Label>البريد الإلكتروني</Label><Input className="mt-2" value={user.email || ""} readOnly /></div><Button className="bg-[image:var(--gradient-primary)]">حفظ التغييرات</Button></div></section>
        <section className="space-y-5"><SettingCard icon={Bell} title="التنبيهات" text="تذكيرات التدريب الأسبوعية وتوصيات الحالات." /><SettingCard icon={Shield} title="الخصوصية" text="بياناتك التعليمية محفوظة داخل بيئة التدريب." /></section>
      </div>
    </DashboardLayout>
  );
}

function SettingCard({ icon: Icon, title, text }: { icon: typeof Bell; title: string; text: string }) {
  return <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"><Icon className="mb-3 h-6 w-6 text-primary" /><h2 className="text-xl font-black">{title}</h2><p className="mt-2 text-muted-foreground">{text}</p></div>;
}
