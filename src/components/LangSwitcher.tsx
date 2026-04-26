import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function LangSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`gap-1.5 rounded-full text-xs font-semibold ${className}`}
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      aria-label="Switch language"
    >
      <Languages className="h-4 w-4" />
      {lang === "ar" ? "EN" : "AR"}
    </Button>
  );
}
