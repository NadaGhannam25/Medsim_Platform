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
  const { dir } = useI18n();
  return (
    <div dir={dir} className="min-h-screen bg-[image:var(--gradient-soft)]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="مدسم" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="text-base font-bold">مدسم</span>
          </Link>
          <LangSwitcher />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="rounded-3xl bg-[image:var(--gradient-soft)] p-3 shadow-[var(--shadow-soft)]">
                <img src={logo} alt="مدسم" width={88} height={88} className="h-22 w-22 object-contain" style={{ height: 88, width: 88 }} />
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
