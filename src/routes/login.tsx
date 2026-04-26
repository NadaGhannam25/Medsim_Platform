import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";

const schema = z.object({
  email: z.string().trim().email({ message: "بريد إلكتروني غير صالح" }).max(255),
  password: z.string().min(6, { message: "كلمة المرور قصيرة جدًا" }).max(128),
});

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "تسجيل الدخول — مدسم" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate({ to: "/dashboard" });
  }, [user, authLoading, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("الرجاء تعبئة جميع الحقول");
      return;
    }
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("email not confirmed")) {
        toast.error("يرجى تأكيد بريدك الإلكتروني أولًا");
      } else {
        toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
      return;
    }
    toast.success("مرحبًا بعودتك");
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthLayout
      title={t("auth.login.title")}
      subtitle={t("auth.login.subtitle")}
      footer={<>{t("auth.noAccount")} <Link to="/signup" className="font-semibold text-primary">{t("auth.createAccount")}</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input id="email" type="email" dir="ltr" className="text-start" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" required />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">{t("auth.forgot")}</Link>
          </div>
          <Input id="password" type="password" dir="ltr" className="text-start" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" disabled={loading} className="h-11 w-full rounded-full bg-[image:var(--gradient-primary)] text-base shadow-[var(--shadow-soft)]">
          {loading ? t("auth.login.loading") : t("auth.login.cta")}
        </Button>
      </form>
    </AuthLayout>
  );
}
