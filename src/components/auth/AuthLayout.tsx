import { Link } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";
import type { ReactNode } from "react";

export function AuthLayout({ title, subtitle, children, footer }: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div dir="rtl" className="min-h-screen bg-[image:var(--gradient-soft)]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <Link to="/" className="mb-10 flex items-center gap-2.5 self-start">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]">
            <Stethoscope className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">طبيبك الافتراضي</span>
        </Link>

        <div className="flex flex-1 flex-col justify-center">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
