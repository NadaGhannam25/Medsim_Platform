import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import {
  Home, BookOpen, PlayCircle, Activity, MessageSquare, Settings,
  LogOut, Stethoscope, Bell, Menu, X
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

type NavItem = {
  label: string;
  icon: typeof Home;
  to?: "/dashboard";
  highlight?: boolean;
  comingSoon?: boolean;
};

const navItems: NavItem[] = [
  { to: "/dashboard", label: "الرئيسية", icon: Home },
  { label: "حالاتي", icon: BookOpen, comingSoon: true },
  { label: "ابدأ حالة جديدة", icon: PlayCircle, highlight: true, comingSoon: true },
  { label: "نقاط القوة والضعف", icon: Activity, comingSoon: true },
  { label: "التغذية الراجعة", icon: MessageSquare, comingSoon: true },
  { label: "الإعدادات", icon: Settings, comingSoon: true },
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
      <Link to="/dashboard" className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]">
          <Stethoscope className="h-5 w-5" />
        </div>
        <span className="text-base font-bold">طبيبك الافتراضي</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = item.to ? location.pathname === item.to : false;
          const Icon = item.icon;
          const className = item.highlight
            ? "my-2 flex items-center gap-3 rounded-xl bg-[image:var(--gradient-primary)] px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90 cursor-pointer w-full text-right"
            : `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition cursor-pointer w-full text-right ${
                active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`;
          const content = (
            <>
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-right">{item.label}</span>
              {item.comingSoon && !item.highlight && (
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">قريبًا</span>
              )}
            </>
          );
          if (item.to) {
            return (
              <Link key={item.label} to={item.to} onClick={() => setMobileOpen(false)} className={className}>
                {content}
              </Link>
            );
          }
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => { setMobileOpen(false); toast.info("هذه الميزة قريبًا"); }}
              className={className}
            >
              {content}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-border pt-4">
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
