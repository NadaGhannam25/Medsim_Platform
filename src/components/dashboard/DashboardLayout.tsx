import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import {
  Home, BookOpen, Settings,
  LogOut, Bell, Menu, X, BarChart3, ClipboardList
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

type NavItem = {
  label: string;
  icon: typeof Home;
  to: "/dashboard" | "/clinical-cases" | "/previous-cases" | "/performance" | "/settings";
  bottom?: boolean;
};

const navItems: NavItem[] = [
  { to: "/dashboard", label: "الرئيسية", icon: Home },
  { to: "/clinical-cases", label: "الحالات السريرية", icon: ClipboardList },
  { to: "/previous-cases", label: "حالاتي السابقة", icon: BookOpen },
  { to: "/performance", label: "تحليلات الأداء", icon: BarChart3 },
  { to: "/settings", label: "الإعدادات", icon: Settings, bottom: true },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const initials = (user?.user_metadata?.full_name || user?.email || "ط")
    .split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();

  const SidebarContent = () => (
    <>
      <Link to="/dashboard" className="mb-8 flex items-center gap-3 px-2">
        <img src={logo} alt="مدسم" className="h-14 w-14 rounded-xl object-contain" />
        <span className="text-xl font-extrabold tracking-tight">مدسم</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.filter((item) => !item.bottom).map((item) => {
          const active = location.pathname === item.to || (item.to === "/clinical-cases" && location.pathname.startsWith("/case/"));
          const Icon = item.icon;
          return (
            <Link key={item.label} to={item.to} onClick={() => setMobileOpen(false)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right text-sm font-bold transition ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-right">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-border pt-4">
        {navItems.filter((item) => item.bottom).map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link key={item.label} to={item.to} onClick={() => setMobileOpen(false)} className={`mb-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right text-sm font-bold transition ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-right">{item.label}</span>
            </Link>
          );
        })}
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{user?.user_metadata?.full_name || "طالب"}</div>
            <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
          </div>
        </div>
        <Button variant="ghost" onClick={handleSignOut} className="mt-2 w-full justify-start gap-3 text-muted-foreground">
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[image:var(--gradient-soft)]">
      {/* Desktop sidebar */}
      <aside className="fixed right-0 top-0 hidden h-screen w-72 flex-col border-l border-border bg-card p-5 lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-72 flex-col bg-card p-5">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="lg:mr-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 lg:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="hidden text-sm text-muted-foreground lg:block">
            <span className="font-semibold text-foreground">لوحة التعلّم السريري</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </div>
        </header>

        <main className="px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
