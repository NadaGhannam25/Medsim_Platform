import { useI18n } from "@/lib/i18n";
import logo from "@/assets/logo.png";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img src={logo} alt="مدسم" width={48} height={48} className="h-12 w-12 object-contain" />
              <span className="text-xl font-extrabold">مدسم</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">{t("footer.tagline")}</p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold">{t("footer.platform")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#how" className="transition hover:text-foreground">{t("nav.how")}</a></li>
              <li><a href="#features" className="transition hover:text-foreground">{t("nav.features")}</a></li>
              <li><a href="#why" className="transition hover:text-foreground">{t("nav.why")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold">{t("footer.contact")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t("footer.support")}</li>
              <li>{t("footer.partnerships")}</li>
              <li>{t("footer.blog")}</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} مدسم. {t("footer.rights")}</div>
          <div className="flex gap-5">
            <a href="#" className="transition hover:text-foreground">{t("footer.privacy")}</a>
            <a href="#" className="transition hover:text-foreground">{t("footer.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
