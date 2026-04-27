import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Bot, ChevronLeft, Droplets, FilePlus2, Filter, Gauge, HeartPulse, Stethoscope, Thermometer, Wind } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { INITIAL_CASE_IDS, LEARNING_CASES } from "@/data/case-flow";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/clinical-cases")({
  component: ClinicalCasesPage,
  head: () => ({ meta: [{ title: "الحالات السريرية — مدسم" }] }),
});

function ClinicalCasesPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const [showGenerated, setShowGenerated] = useState(false);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  const cases = useMemo(() => {
    const base = LEARNING_CASES.filter((c) => INITIAL_CASE_IDS.includes(c.id));
    if (!showGenerated) return base;
    // Show all generated, optionally rotated by generation count for variety on each click
    const generated = LEARNING_CASES.filter((c) => !INITIAL_CASE_IDS.includes(c.id));
    const offset = (generation - 1) % Math.max(1, generated.length);
    const rotated = [...generated.slice(offset), ...generated.slice(0, offset)];
    return [...base, ...rotated.slice(0, 5)];
  }, [showGenerated, generation]);

  const generateCases = () => {
    setShowGenerated(true);
    setGeneration((g) => g + 1);
    toast.success(t("cases.generated.toast"));
  };

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
            <Link to="/dashboard" className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground transition hover:text-foreground">
              <ArrowLeft className="h-4 w-4 rotate-180" /> {t("cases.back")}
            </Link>
            <span>/</span>
            <span>{t("cases.crumb")}</span>
          </div>
          <h1 className="text-3xl font-black text-foreground">{t("cases.title")}</h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">{t("cases.subtitle")}</p>
        </div>
        <Button onClick={generateCases} className="h-12 gap-2 bg-[image:var(--gradient-primary)] text-base font-black shadow-[var(--shadow-soft)]">
          <FilePlus2 className="h-5 w-5" /> {t("cases.generate")}
        </Button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <JourneyStat icon={Stethoscope} label={t("cases.stat.journey")} value={t("cases.stat.journey.v")} />
        <JourneyStat icon={Bot} label={t("cases.stat.patient")} value={t("cases.stat.patient.v")} />
        <JourneyStat icon={Filter} label={t("cases.stat.available")} value={`${cases.length}`} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
        {cases.map((clinicalCase) => (
          <article key={clinicalCase.id} className="group flex min-h-[400px] flex-col rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-black text-primary-foreground ${clinicalCase.patient.avatarColor}`}>
                  {clinicalCase.patient.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-black text-foreground">{clinicalCase.patient.name}</h2>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm font-medium text-muted-foreground">
                    <span>{clinicalCase.patient.age} {t("cases.year")}</span>
                    <span>{clinicalCase.patient.gender}</span>
                    <span>{clinicalCase.patient.mrn}</span>
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-black text-accent-foreground">{clinicalCase.difficulty}</span>
            </div>

            <div className="rounded-2xl border border-border bg-muted/45 p-4">
              <div className="text-xs font-black text-primary">{t("cases.chief")}</div>
              <p className="mt-1 text-base font-bold leading-relaxed text-foreground">{clinicalCase.chiefComplaint}</p>
            </div>

            <div className="mt-4 space-y-3 text-sm leading-relaxed">
              <InfoRow label={t("cases.specialty")} value={clinicalCase.specialty} />
              <InfoRow label={t("cases.summary")} value={clinicalCase.briefSummary} />
            </div>

            {/* Vital signs */}
            <div className="mt-4 rounded-2xl border border-primary/15 bg-[image:var(--gradient-soft)] p-3">
              <div className="mb-2 text-[11px] font-black uppercase tracking-wide text-primary">{t("vitals.title")}</div>
              <div className="grid grid-cols-5 gap-2">
                <Vital icon={Thermometer} label={t("vitals.temp")} value={`${clinicalCase.vitals.temp}°`} status={vitalStatus("temp", clinicalCase.vitals.temp)} />
                <Vital icon={HeartPulse} label={t("vitals.hr")} value={clinicalCase.vitals.hr} status={vitalStatus("hr", clinicalCase.vitals.hr)} />
                <Vital icon={Gauge} label={t("vitals.bp")} value={clinicalCase.vitals.bp} status={vitalStatus("bp", clinicalCase.vitals.bp)} />
                <Vital icon={Wind} label={t("vitals.rr")} value={clinicalCase.vitals.rr} status={vitalStatus("rr", clinicalCase.vitals.rr)} />
                <Vital icon={Droplets} label={t("vitals.spo2")} value={clinicalCase.vitals.spo2} status={vitalStatus("spo2", clinicalCase.vitals.spo2)} />
              </div>
            </div>

            <div className="mt-auto pt-5">
              <Link to="/case/$caseId" params={{ caseId: clinicalCase.id }} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-base font-black text-primary-foreground shadow-[var(--shadow-soft)] transition group-hover:bg-primary/90">
                {t("cases.start")}
                <ChevronLeft className={`h-5 w-5 ${lang === "en" ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </DashboardLayout>
  );
}

function arabicToNumber(str: string): number {
  const map: Record<string, string> = { "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9" };
  return parseFloat(str.replace(/[٠-٩]/g, (d) => map[d] ?? d).replace(/[^\d.]/g, ""));
}

type VStatus = "normal" | "abnormal";
function vitalStatus(key: "temp" | "hr" | "bp" | "rr" | "spo2", raw: string): VStatus {
  if (key === "bp") {
    const [sys, dia] = raw.split("/").map(arabicToNumber);
    if (!sys || !dia) return "normal";
    return sys >= 140 || sys < 90 || dia >= 90 || dia < 60 ? "abnormal" : "normal";
  }
  const n = arabicToNumber(raw);
  if (!isFinite(n)) return "normal";
  if (key === "temp") return n >= 38 || n < 36 ? "abnormal" : "normal";
  if (key === "hr") return n > 100 || n < 60 ? "abnormal" : "normal";
  if (key === "rr") return n > 20 || n < 12 ? "abnormal" : "normal";
  if (key === "spo2") return n < 95 ? "abnormal" : "normal";
  return "normal";
}

function Vital({ icon: Icon, label, value, status }: { icon: typeof Stethoscope; label: string; value: string; status: VStatus }) {
  const abnormal = status === "abnormal";
  return (
    <div className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2 text-center transition ${abnormal ? "border-destructive/40 bg-destructive/5" : "border-border bg-card"}`}>
      <Icon className={`h-4 w-4 ${abnormal ? "text-destructive" : "text-primary"}`} />
      <div className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground line-clamp-1">{label}</div>
      <div className={`text-sm font-black tabular-nums leading-none ${abnormal ? "text-destructive" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

function JourneyStat({ icon: Icon, label, value }: { icon: typeof Stethoscope; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
        <div>
          <div className="text-sm font-bold text-muted-foreground">{label}</div>
          <div className="text-xl font-black text-foreground">{value}</div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-black text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-bold text-foreground">{value}</div>
    </div>
  );
}
