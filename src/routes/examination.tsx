import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Stethoscope, User2, FileText, ClipboardList, ChevronDown, ChevronLeft,
  Save, ArrowLeft, Activity, Heart, Thermometer, Wind, Droplets,
  AlertCircle, Pill, History, CheckCircle2, Sparkles, Trash2, RotateCw,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BodyMap } from "@/components/examination/BodyMap";
import {
  CLINICAL_CASES, REGION_LABELS, SEVERITY_OPTIONS, SYMPTOM_OPTIONS,
  type BodyRegionId, type ClinicalCase, type Severity, type SymptomType,
} from "@/data/clinical-cases";

export const Route = createFileRoute("/examination")({
  component: ExaminationPage,
  head: () => ({ meta: [{ title: "الفحص السريري — طبيبك الافتراضي" }] }),
});

type Finding = {
  region: BodyRegionId;
  severity: Severity;
  symptom: SymptomType;
  notes: string;
};

function ExaminationPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<"front" | "back">("front");
  const [activeCaseId, setActiveCaseId] = useState<string>(CLINICAL_CASES[0].id);
  const [findings, setFindings] = useState<Record<string, Finding[]>>({});
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null);
  const [activeFindingRegion, setActiveFindingRegion] = useState<BodyRegionId | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  const activeCase = useMemo(
    () => CLINICAL_CASES.find((c) => c.id === activeCaseId)!,
    [activeCaseId]
  );
  const caseFindings = findings[activeCaseId] ?? [];
  const selectedRegions = caseFindings.map((f) => f.region);

  const toggleRegion = (region: BodyRegionId) => {
    setFindings((prev) => {
      const list = prev[activeCaseId] ?? [];
      const exists = list.find((f) => f.region === region);
      if (exists) {
        const next = list.filter((f) => f.region !== region);
        if (activeFindingRegion === region) setActiveFindingRegion(null);
        return { ...prev, [activeCaseId]: next };
      }
      const newFinding: Finding = { region, severity: "moderate", symptom: "pain", notes: "" };
      setActiveFindingRegion(region);
      // Smart feedback
      if (activeCase.expectedRegions.includes(region)) {
        toast.success(`اختيار سريري دقيق: ${REGION_LABELS[region]}`, { icon: "🎯" });
      }
      return { ...prev, [activeCaseId]: [...list, newFinding] };
    });
  };

  const updateFinding = (region: BodyRegionId, patch: Partial<Finding>) => {
    setFindings((prev) => {
      const list = prev[activeCaseId] ?? [];
      return {
        ...prev,
        [activeCaseId]: list.map((f) => (f.region === region ? { ...f, ...patch } : f)),
      };
    });
  };

  const removeFinding = (region: BodyRegionId) => {
    setFindings((prev) => ({
      ...prev,
      [activeCaseId]: (prev[activeCaseId] ?? []).filter((f) => f.region !== region),
    }));
    if (activeFindingRegion === region) setActiveFindingRegion(null);
  };

  const resetCase = () => {
    setFindings((prev) => ({ ...prev, [activeCaseId]: [] }));
    setActiveFindingRegion(null);
    toast.info("تمت إعادة تعيين الفحص");
  };

  const saveExam = () => {
    if (caseFindings.length === 0) {
      toast.error("لم تحدد أي منطقة بعد");
      return;
    }
    toast.success(`تم حفظ ${caseFindings.length} نتيجة في ملف ${activeCase.patient.name}`);
  };

  const continueToInvestigations = () => {
    if (caseFindings.length === 0) {
      toast.error("سجّل نتائج الفحص قبل الانتقال");
      return;
    }
    toast.info("الانتقال إلى الفحوصات والتحاليل قريبًا");
    navigate({ to: "/dashboard" });
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
              aria-label="رجوع"
            >
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold leading-tight text-slate-900">الفحص السريري</div>
              <div className="text-xs text-slate-500">منصة تقييم تفاعلية للمريض</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetCase}>
              <RotateCw className="h-4 w-4" />
              إعادة تعيين
            </Button>
            <Button variant="outline" size="sm" onClick={saveExam}>
              <Save className="h-4 w-4" />
              حفظ الفحص
            </Button>
            <Button size="sm" onClick={continueToInvestigations} className="bg-gradient-to-l from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700">
              الانتقال للفحوصات والتحاليل
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Case selector strip */}
      <div className="border-b border-slate-200 bg-white">
        <div className="flex gap-2 overflow-x-auto px-6 py-3">
          {CLINICAL_CASES.map((c) => {
            const active = c.id === activeCaseId;
            const count = (findings[c.id] ?? []).length;
            return (
              <button
                key={c.id}
                onClick={() => { setActiveCaseId(c.id); setActiveFindingRegion(null); }}
                className={`group flex shrink-0 items-center gap-3 rounded-xl border px-4 py-2.5 text-right transition ${
                  active
                    ? "border-sky-500 bg-sky-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white text-xs font-bold ${c.patient.avatarColor}`}>
                  {c.patient.name.charAt(0)}
                </div>
                <div className="text-right">
                  <div className={`text-xs font-semibold ${active ? "text-sky-700" : "text-slate-700"}`}>{c.patient.name}</div>
                  <div className="text-[10px] text-slate-500">{c.categoryLabel} · {c.patient.age} سنة</div>
                </div>
                {count > 0 && (
                  <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3-column layout */}
      <main className="mx-auto grid w-full gap-5 px-6 py-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Center: Body + findings */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Body examination card */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.1)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">حدد موضع الألم</h2>
                <p className="mt-0.5 text-xs text-slate-500">انقر على المنطقة المصابة من جسم المريض</p>
              </div>
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                <button
                  onClick={() => setView("front")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    view === "front" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500"
                  }`}
                >
                  عرض أمامي
                </button>
                <button
                  onClick={() => setView("back")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    view === "back" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500"
                  }`}
                >
                  عرض خلفي
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-b from-sky-50/60 to-white py-4">
              <BodyMap
                view={view}
                selected={selectedRegions}
                expectedRegions={activeCase.expectedRegions}
                onToggle={toggleRegion}
              />
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-500">
              <Legend color="bg-rose-500" label="مختار" />
              <Legend color="bg-emerald-500" label="إشارة سريرية ذكية" />
              <Legend color="bg-slate-200" label="غير مختار" />
            </div>
          </section>

          {/* Findings panel */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.1)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">المناطق المحددة</h3>
              </div>
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-bold text-sky-700">
                {caseFindings.length}
              </span>
            </div>

            {caseFindings.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                <Sparkles className="mx-auto h-6 w-6 text-slate-400" />
                <p className="mt-2 text-xs text-slate-500">انقر على الجسم لبدء توثيق النتائج</p>
              </div>
            ) : (
              <div className="space-y-2">
                {caseFindings.map((f) => {
                  const isOpen = activeFindingRegion === f.region;
                  const matched = activeCase.expectedRegions.includes(f.region);
                  return (
                    <div
                      key={f.region}
                      className={`rounded-xl border transition ${
                        isOpen ? "border-sky-300 bg-sky-50/40" : "border-slate-200 bg-white"
                      }`}
                    >
                      <button
                        onClick={() => setActiveFindingRegion(isOpen ? null : f.region)}
                        className="flex w-full items-center justify-between px-3 py-2.5 text-right"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${matched ? "bg-emerald-500" : "bg-rose-500"}`} />
                          <span className="text-sm font-semibold text-slate-800">{REGION_LABELS[f.region]}</span>
                          {matched && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                        </div>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isOpen && (
                        <div className="space-y-3 border-t border-slate-200/70 px-3 py-3">
                          {/* Severity */}
                          <div>
                            <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">شدة الألم</label>
                            <div className="flex gap-1.5">
                              {SEVERITY_OPTIONS.map((s) => (
                                <button
                                  key={s.value}
                                  onClick={() => updateFinding(f.region, { severity: s.value })}
                                  className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                                    f.severity === s.value ? s.color : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                                  }`}
                                >
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          {/* Symptom */}
                          <div>
                            <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">نوع العرض</label>
                            <div className="flex flex-wrap gap-1">
                              {SYMPTOM_OPTIONS.map((s) => (
                                <button
                                  key={s.value}
                                  onClick={() => updateFinding(f.region, { symptom: s.value })}
                                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                                    f.symptom === s.value
                                      ? "border-sky-500 bg-sky-500 text-white"
                                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                  }`}
                                >
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          {/* Notes */}
                          <div>
                            <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">ملاحظات الطبيب</label>
                            <Textarea
                              value={f.notes}
                              onChange={(e) => updateFinding(f.region, { notes: e.target.value })}
                              placeholder="مثال: ألم يزداد عند الحركة، يخف بالراحة…"
                              className="min-h-[60px] resize-none text-xs"
                            />
                          </div>
                          <button
                            onClick={() => removeFinding(f.region)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700"
                          >
                            <Trash2 className="h-3 w-3" />
                            إزالة هذه المنطقة
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right: Patient EMR panel */}
        <aside className="space-y-4">
          {/* Patient identity */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.1)]">
            <div className={`bg-gradient-to-l ${activeCase.patient.avatarColor} px-5 py-4 text-white`}>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-xl font-bold backdrop-blur">
                  {activeCase.patient.name.charAt(0)}
                </div>
                <div>
                  <div className="text-base font-bold">{activeCase.patient.name}</div>
                  <div className="mt-0.5 text-xs opacity-90">
                    {activeCase.patient.age} سنة · {activeCase.patient.gender}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-mono">
                    رقم الملف: {activeCase.patient.mrn}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-3 rounded-xl border border-rose-200/60 bg-rose-50/50 px-3 py-2.5">
                <div className="mb-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-rose-700">
                  <AlertCircle className="h-3 w-3" />
                  الشكوى الرئيسية
                </div>
                <p className="text-xs leading-relaxed text-slate-800">{activeCase.chiefComplaint}</p>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                <Vital icon={Heart} value={activeCase.vitals.hr} label="نبض" />
                <Vital icon={Activity} value={activeCase.vitals.bp} label="ضغط" small />
                <Vital icon={Thermometer} value={activeCase.vitals.temp} label="حرارة" />
                <Vital icon={Wind} value={activeCase.vitals.rr} label="تنفس" />
                <Vital icon={Droplets} value={activeCase.vitals.spo2} label="O₂" />
              </div>
            </div>
          </section>

          {/* Medical record */}
          <Section title="السجل الطبي" icon={FileText}>
            <RecordRow label="التاريخ المرضي" items={activeCase.pastMedicalHistory} />
            <RecordRow label="الأمراض المزمنة" items={activeCase.chronicDiseases} />
            <RecordRow label="الحساسية" items={activeCase.allergies} accent="rose" />
            <RecordRow label="الأدوية الحالية" items={activeCase.medications} icon={Pill} />
            <RecordRow label="تشخيصات سابقة" items={activeCase.previousDiagnoses} />
          </Section>

          {/* Visit history */}
          <Section title="الزيارات السابقة" icon={History}>
            <div className="space-y-1.5">
              {activeCase.visits.map((v) => {
                const open = expandedVisit === v.id;
                return (
                  <div key={v.id} className={`rounded-lg border transition ${open ? "border-sky-300 bg-sky-50/40" : "border-slate-200 bg-white"}`}>
                    <button
                      onClick={() => setExpandedVisit(open ? null : v.id)}
                      className="flex w-full items-start justify-between gap-2 px-3 py-2 text-right"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-500">{v.date}</span>
                          <span className="text-xs font-semibold text-slate-800">{v.reason}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-500">{v.summary}</p>
                      </div>
                      <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && (
                      <div className="border-t border-slate-200/70 px-3 py-2 text-[11px] leading-relaxed text-slate-600">
                        {v.details}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        </aside>
      </main>
    </div>
  );
}

/* ---------- Small helpers ---------- */

function Vital({ icon: Icon, value, label, small }: { icon: typeof Heart; value: string; label: string; small?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50/60 px-1 py-2">
      <Icon className="h-3 w-3 text-sky-600" />
      <div className={`mt-0.5 font-bold text-slate-800 ${small ? "text-[10px]" : "text-xs"}`}>{value}</div>
      <div className="text-[9px] text-slate-500">{label}</div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: typeof FileText; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.1)]">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-sky-600" />
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      </div>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function RecordRow({
  label, items, accent, icon: Icon,
}: { label: string; items: string[]; accent?: "rose"; icon?: typeof Pill }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((it, i) => (
          <span
            key={i}
            className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
              accent === "rose"
                ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}
