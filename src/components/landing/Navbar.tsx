import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LangSwitcher } from "@/components/LangSwitcher";
import { useI18n } from "@/lib/i18n";
import logo from "@/assets/logo.png";

export function Navbar() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="مدسم" width={64} height={64} className="h-16 w-16 object-contain" />
          <span className="text-2xl font-extrabold tracking-tight">مدسم</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#how" className="text-sm text-muted-foreground transition hover:text-foreground">{t("nav.how")}</a>
          <a href="#features" className="text-sm text-muted-foreground transition hover:text-foreground">{t("nav.features")}</a>
          <a href="#why" className="text-sm text-muted-foreground transition hover:text-foreground">{t("nav.why")}</a>
        </nav>
        <div className="flex items-center gap-2">
          <LangSwitcher />
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/login">{t("nav.login")}</Link>
          </Button>
          <Button asChild className="bg-[image:var(--gradient-primary)] shadow-[var(--shadow-soft)]">
            <Link to="/signup">{t("nav.start")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
