import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({ meta: [{ title: "تعيين كلمة مرور جديدة" }] }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("يجب أن تكون كلمة المرور ٨ أحرف على الأقل");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error("تعذّر تحديث كلمة المرور");
      return;
    }
    toast.success("تم تحديث كلمة المرور");
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthLayout title="كلمة مرور جديدة" subtitle="اختر كلمة مرور قوية لحسابك">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور الجديدة</Label>
          <Input id="password" type="password" dir="ltr" className="text-right" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-[image:var(--gradient-primary)] shadow-[var(--shadow-soft)]">
          {loading ? "جارٍ الحفظ..." : "حفظ كلمة المرور"}
        </Button>
      </form>
    </AuthLayout>
  );
}
