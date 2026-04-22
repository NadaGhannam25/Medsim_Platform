import { Link } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]">
            <Stethoscope className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">طبيبك الافتراضي</span>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#how" className="text-sm text-muted-foreground transition hover:text-foreground">كيف يعمل</a>
          <a href="#features" className="text-sm text-muted-foreground transition hover:text-foreground">المميزات</a>
          <a href="#why" className="text-sm text-muted-foreground transition hover:text-foreground">لماذا نحن</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/login">تسجيل الدخول</Link>
          </Button>
          <Button asChild className="bg-[image:var(--gradient-primary)] shadow-[var(--shadow-soft)]">
            <Link to="/signup">ابدأ الآن</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
