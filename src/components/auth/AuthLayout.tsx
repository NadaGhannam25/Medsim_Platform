import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LangSwitcher } from "@/components/LangSwitcher";
import { useI18n } from "@/lib/i18n";
import logo from "@/assets/logo.png";

export function AuthLayout({ title, subtitle, children, footer }: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { dir, lang } = useI18n();
  const brandName = lang === "ar" ? "مدسم" : "Madsam";
  return (
    <div dir={dir} className="min-h-screen bg-[image:var(--gradient-soft)]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt={brandName} width={48} height={48} className="h-12 w-12 object-contain" />
            <span className="text-lg font-bold">{brandName}</span>
          </Link>
          <LangSwitcher />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="rounded-3xl bg-[image:var(--gradient-soft)] p-4 shadow-[var(--shadow-soft)]">
                <img src={logo} alt={brandName} width={140} height={140} className="object-contain" style={{ height: 140, width: 140 }} />
              </div>
              <h1 className="mt-6 text-2xl font-extrabold tracking-tight">{title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <div className="mt-2">{children}</div>
          </div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
