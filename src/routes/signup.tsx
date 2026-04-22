import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  fullName: z.string().trim().min(2, { message: "الاسم قصير جدًا" }).max(100),
  email: z.string().trim().email({ message: "بريد إلكتروني غير صالح" }).max(255),
  password: z.string().min(8, { message: "يجب أن تكون كلمة المرور ٨ أحرف على الأقل" }).max(128),
});

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "إنشاء حساب — طبيبك الافتراضي" }] }),
});

function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ fullName, email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: parsed.data.fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("registered") ? "هذا البريد مسجّل مسبقًا" : "تعذّر إنشاء الحساب");
      return;
    }
    toast.success("تم إنشاء حسابك بنجاح");
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthLayout
      title="ابدأ رحلتك الطبية"
      subtitle="أنشئ حسابك المجاني وانضم إلى آلاف الطلاب"
      footer={<>لديك حساب؟ <Link to="/login" className="font-semibold text-primary">سجّل الدخول</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">الاسم الكامل</Label>
          <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="مثال: أحمد محمد" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" dir="ltr" className="text-right" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input id="password" type="password" dir="ltr" className="text-right" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="٨ أحرف على الأقل" required />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-[image:var(--gradient-primary)] shadow-[var(--shadow-soft)]">
          {loading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
        </Button>
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">أو</span></div>
        </div>
        <GoogleButton />
        <p className="pt-2 text-center text-xs text-muted-foreground">
          بإنشاء الحساب فإنك توافق على شروط الاستخدام وسياسة الخصوصية
        </p>
      </form>
    </AuthLayout>
  );
}
