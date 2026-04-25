import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="مدسم" className="h-10 w-10 rounded-xl object-contain" />
          <span className="text-lg font-bold tracking-tight">مدسم</span>
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
