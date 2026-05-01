import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, Bell, BookOpen, Globe, Info, Shield, User2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "الإعدادات — مدسم" }] }),
});

function SettingsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t, lang, setLang, dir } = useI18n();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;

  return (
    <DashboardLayout>
      <div dir={dir}>
        <Link to="/dashboard" className="mb-2 inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 rotate-180" /> {t("settings.back")}
        </Link>
        <h1 className="text-3xl font-black">{t("settings.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("settings.subtitle")}</p>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black"><User2 className="h-5 w-5 text-primary" /> {t("settings.profile")}</h2>
            <div className="space-y-4">
              <div><Label>{t("settings.name")}</Label><Input className="mt-2" defaultValue={user.user_metadata?.full_name || (lang === "ar" ? "طالب طب" : "Medical student")} /></div>
              <div><Label>{t("settings.email")}</Label><Input className="mt-2" value={user.email || ""} readOnly /></div>
              <Button className="bg-[image:var(--gradient-primary)]">{t("settings.save")}</Button>
            </div>
          </section>

          <section className="space-y-5">
            {/* Language selector */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="mb-2 flex items-center gap-2 text-xl font-black"><Globe className="h-5 w-5 text-primary" /> {t("settings.language")}</h2>
              <p className="mb-4 text-sm text-muted-foreground">{t("settings.language.text")}</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLang("ar")}
                  className={`rounded-2xl border-2 px-4 py-4 text-base font-black transition ${lang === "ar" ? "border-primary bg-primary/10 text-primary shadow-[var(--shadow-soft)]" : "border-border bg-muted/40 text-muted-foreground hover:border-primary/40"}`}
                >
                  {t("settings.language.ar")}
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-wide opacity-70">RTL</div>
                </button>
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={`rounded-2xl border-2 px-4 py-4 text-base font-black transition ${lang === "en" ? "border-primary bg-primary/10 text-primary shadow-[var(--shadow-soft)]" : "border-border bg-muted/40 text-muted-foreground hover:border-primary/40"}`}
                >
                  {t("settings.language.en")}
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-wide opacity-70">LTR</div>
                </button>
              </div>
            </div>

            <SettingCard icon={Bell} title={t("settings.notifications")} text={t("settings.notifications.text")} />
            <SettingCard icon={Shield} title={t("settings.privacy")} text={t("settings.privacy.text")} />
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SettingCard({ icon: Icon, title, text }: { icon: typeof Bell; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <Icon className="mb-3 h-6 w-6 text-primary" />
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mt-2 text-muted-foreground">{text}</p>
    </div>
  );
}
