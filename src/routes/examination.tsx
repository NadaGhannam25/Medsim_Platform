import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Activity, AlertCircle, ArrowLeft, Brain, CheckCircle2, ChevronDown, ChevronLeft,
  ClipboardList, Droplets, FileText, Heart, History, Microscope, NotebookPen,
  Pill, RotateCw, Save, ShieldCheck, Sparkles, Stethoscope, Target, Thermometer,
  Trash2, User2, Wind,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BodyMap } from "@/components/examination/BodyMap";
import {
  CLINICAL_CASES, REGION_LABELS, REGION_SIDE, SEVERITY_OPTIONS, SYMPTOM_OPTIONS,
  type BodyRegionId, type ClinicalCase, type Severity, type SymptomType,
} from "@/data/clinical-cases";

export const Route = createFileRoute("/examination")({
  component: ExaminationPage,
  head: () => ({ meta: [{ title: "الفحص السريري المتقدم — طبيبك الافتراضي" }] }),
});

type Finding = {
  region: BodyRegionId;
  severity: Severity;
  symptom: SymptomType;
  notes: string;
};

type DiagnosisState = {
  mostLikely: string;
  differentials: string;
  justification: string;
  nextStep: string;
};

const emptyDiagnosis: DiagnosisState = {
  mostLikely: "",
  differentials: "",
  justification: "",
  nextStep: "",
};

function ExaminationPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<"front" | "back">("front");
  const [activeCaseId, setActiveCaseId] = useState<string>(CLINICAL_CASES[0].id);
  const [findings, setFindings] = useState<Record<string, Finding[]>>({});
  const [diagnoses, setDiagnoses] = useState<Record<string, DiagnosisState>>({});
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
  const diagnosis = diagnoses[activeCaseId] ?? emptyDiagnosis;
  const selectedRegions = caseFindings.map((f) => f.region);
  const matchedCount = caseFindings.filter((f) => activeCase.expectedRegions.includes(f.region)).length;
  const reasoningScore = Math.min(100, Math.round((matchedCount / Math.max(activeCase.expectedRegions.length, 1)) * 70 + Math.min(caseFindings.length, 4) * 7.5));

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
      if (activeCase.expectedRegions.includes(region)) {
        toast.success(`تطابق سريري مهم: ${REGION_LABELS[region]}`, { icon: "🎯" });
      }
      return { ...prev, [activeCaseId]: [...list, newFinding] };
    });
  };

  const updateFinding = (region: BodyRegionId, patch: Partial<Finding>) => {
    setFindings((prev) => ({
      ...prev,
      [activeCaseId]: (prev[activeCaseId] ?? []).map((f) => (f.region === region ? { ...f, ...patch } : f)),
    }));
  };

  const updateDiagnosis = (patch: Partial<DiagnosisState>) => {
    setDiagnoses((prev) => ({ ...prev, [activeCaseId]: { ...(prev[activeCaseId] ?? emptyDiagnosis), ...patch } }));
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
    setDiagnoses((prev) => ({ ...prev, [activeCaseId]: emptyDiagnosis }));
    setActiveFindingRegion(null);
    toast.info("تمت إعادة تعيين الفحص والتشخيص");
  };

  const saveExam = () => {
    if (caseFindings.length === 0) {
      toast.error("لم تحدد أي منطقة بعد");
      return;
    }
    toast.success(`تم حفظ ${caseFindings.length} نتيجة سريرية في ملف ${activeCase.patient.name}`);
  };

  const continueToInvestigations = () => {
    if (caseFindings.length === 0) {
      toast.error("سجّل موضع العرض بدقة قبل الانتقال");
      return;
    }
    toast.info("تم تجهيز ملخص الفحص للتحاليل والفحوصات");
    navigate({ to: "/dashboard" });
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[image:var(--gradient-soft)] text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="flex min-h-20 flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-[var(--shadow-card)] transition hover:bg-muted"
              aria-label="رجوع"
            >
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black leading-tight text-foreground">الفحص السريري</h1>
              <p className="mt-1 text-sm font-medium text-muted-foreground">تحديد تشريحي دقيق وربط سريري بالتشخيص</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={resetCase} className="h-11 gap-2 text-sm font-bold">
              <RotateCw className="h-4 w-4" />
              إعادة تعيين
            </Button>
            <Button variant="outline" onClick={saveExam} className="h-11 gap-2 text-sm font-bold">
              <Save className="h-4 w-4" />
              حفظ الفحص
            </Button>
            <Button onClick={continueToInvestigations} className="h-11 gap-2 bg-[image:var(--gradient-primary)] text-sm font-bold shadow-[var(--shadow-soft)]">
              الانتقال للفحوصات والتحاليل
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-card/95">
        <div className="flex gap-3 overflow-x-auto px-6 py-4">
          {CLINICAL_CASES.map((c) => {
            const active = c.id === activeCaseId;
            const count = (findings[c.id] ?? []).length;
            return (
              <button
                key={c.id}
                onClick={() => { setActiveCaseId(c.id); setActiveFindingRegion(null); }}
                className={`group flex min-w-[230px] shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-right transition ${
                  active ? "border-primary bg-accent shadow-[var(--shadow-card)]" : "border-border bg-card hover:bg-muted"
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-base font-black text-white ${c.patient.avatarColor}`}>
                  {c.patient.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-base font-extrabold text-foreground">{c.patient.name}</div>
                  <div className="mt-0.5 text-sm font-medium text-muted-foreground">{c.categoryLabel} · {c.patient.age} سنة</div>
                </div>
                {count > 0 && <span className="rounded-full bg-destructive px-2 py-1 text-xs font-black text-destructive-foreground">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <main className="grid w-full gap-6 px-6 py-6 2xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="grid gap-6 xl:grid-cols-[minmax(520px,1fr)_410px]">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-black text-primary">
                  <Target className="h-5 w-5" />
                  حدد الموقع بدقة
                </div>
                <h2 className="mt-1 text-2xl font-black text-foreground">حدد موضع الألم أو العرض</h2>
                <p className="mt-1 text-base leading-relaxed text-muted-foreground">اختر منطقة تشريحية صغيرة؛ سيُستخدم الاختيار في دعم التفكير التشخيصي.</p>
              </div>
              <div className="flex rounded-2xl border border-border bg-muted p-1.5">
                <button
                  onClick={() => setView("front")}
                  className={`rounded-xl px-5 py-2.5 text-base font-extrabold transition ${view === "front" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  عرض أمامي
                </button>
                <button
                  onClick={() => setView("back")}
                  className={`rounded-xl px-5 py-2.5 text-base font-extrabold transition ${view === "back" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  عرض خلفي
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-gradient-to-b from-accent/70 to-card px-4 py-6">
              <BodyMap
                view={view}
                selected={selectedRegions}
                expectedRegions={activeCase.expectedRegions}
                onToggle={toggleRegion}
              />
            </div>

            <div className="mt-5 grid gap-3 text-sm font-bold text-muted-foreground sm:grid-cols-3">
              <Legend color="bg-destructive" label="منطقة محددة" />
              <Legend color="bg-emerald-500" label="متوافق سريريًا" />
              <Legend color="bg-muted" label="متاح للتحديد" />
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-black text-foreground">المناطق المحددة</h3>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-black text-primary">{caseFindings.length}</span>
            </div>

            {caseFindings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-7 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-base font-bold text-muted-foreground">انقر على منطقة دقيقة من الجسم لبدء التوثيق.</p>
              </div>
            ) : (
              <div className="max-h-[720px] space-y-3 overflow-y-auto pr-1">
                {caseFindings.map((f) => {
                  const isOpen = activeFindingRegion === f.region;
                  const matched = activeCase.expectedRegions.includes(f.region);
                  return (
                    <div key={f.region} className={`rounded-2xl border transition ${isOpen ? "border-primary bg-accent/50" : "border-border bg-card"}`}>
                      <button onClick={() => setActiveFindingRegion(isOpen ? null : f.region)} className="flex w-full items-center justify-between px-4 py-3 text-right">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${matched ? "bg-emerald-500" : "bg-destructive"}`} />
                          <span className="truncate text-base font-black text-foreground">{REGION_LABELS[f.region]}</span>
                          {REGION_SIDE[f.region] && <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">{REGION_SIDE[f.region]}</span>}
                          {matched && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                        </div>
                        <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isOpen && (
                        <div className="space-y-4 border-t border-border px-4 py-4">
                          <div>
                            <label className="mb-2 block text-sm font-black text-foreground">شدة الألم</label>
                            <div className="grid grid-cols-3 gap-2">
                              {SEVERITY_OPTIONS.map((s) => (
                                <button key={s.value} onClick={() => updateFinding(f.region, { severity: s.value })} className={`rounded-xl border px-2 py-2.5 text-sm font-black transition ${f.severity === s.value ? s.color : "border-border bg-card text-muted-foreground hover:bg-muted"}`}>
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-black text-foreground">نوع العرض</label>
                            <div className="flex flex-wrap gap-2">
                              {SYMPTOM_OPTIONS.map((s) => (
                                <button key={s.value} onClick={() => updateFinding(f.region, { symptom: s.value })} className={`rounded-full border px-3 py-1.5 text-sm font-bold transition ${f.symptom === s.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted"}`}>
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-black text-foreground">ملاحظات الطبيب</label>
                            <Textarea value={f.notes} onChange={(e) => updateFinding(f.region, { notes: e.target.value })} placeholder="مثال: ألم نابض، يزداد بالجس أو الحركة، ينتشر لمنطقة محددة…" className="min-h-[86px] resize-none text-base leading-relaxed" />
                          </div>
                          <button onClick={() => removeFinding(f.region)} className="flex items-center gap-1.5 text-sm font-black text-destructive hover:opacity-80">
                            <Trash2 className="h-4 w-4" />
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

          <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] xl:col-span-2">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-black text-primary"><Brain className="h-5 w-5" />التشخيص</div>
                <h2 className="mt-1 text-2xl font-black text-foreground">التفكير السريري وخطة التعامل</h2>
              </div>
              <div className="min-w-[220px] rounded-2xl border border-border bg-muted p-3">
                <div className="mb-2 flex items-center justify-between text-sm font-black"><span>مؤشر الترابط السريري</span><span className="text-primary">{reasoningScore}%</span></div>
                <div className="h-2 rounded-full bg-card"><div className="h-2 rounded-full bg-[image:var(--gradient-primary)]" style={{ width: `${reasoningScore}%` }} /></div>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <ClinicalField label="التشخيص الأكثر احتمالًا" value={diagnosis.mostLikely} onChange={(v) => updateDiagnosis({ mostLikely: v })} placeholder="مثال: متلازمة الشريان التاجي الحادة" />
              <ClinicalField label="التشخيصات التفريقية" value={diagnosis.differentials} onChange={(v) => updateDiagnosis({ differentials: v })} placeholder="اكتب تشخيصات تفريقية مفصولة بسطور" />
              <ClinicalField label="مبرر التشخيص" value={diagnosis.justification} onChange={(v) => updateDiagnosis({ justification: v })} placeholder="اربط الشكوى، التاريخ، موضع الألم، والفحص السريري" tall />
              <ClinicalField label="الخطوة التالية" value={diagnosis.nextStep} onChange={(v) => updateDiagnosis({ nextStep: v })} placeholder="الفحوصات العاجلة، التصرف الأولي، أو خطة المتابعة" tall />
            </div>
            <SmartFeedback activeCase={activeCase} findings={caseFindings} diagnosis={diagnosis} />
          </section>
        </div>

        <PatientPanel activeCase={activeCase} expandedVisit={expandedVisit} setExpandedVisit={setExpandedVisit} />
      </main>
    </div>
  );
}

function SmartFeedback({ activeCase, findings, diagnosis }: { activeCase: ClinicalCase; findings: Finding[]; diagnosis: DiagnosisState }) {
  const matched = findings.filter((f) => activeCase.expectedRegions.includes(f.region));
  const missed = activeCase.expectedRegions.filter((r) => !findings.some((f) => f.region === r));
  const hasDiagnosis = diagnosis.mostLikely.trim().length > 2 && diagnosis.justification.trim().length > 8;
  return (
    <div className="mt-5 grid gap-3 lg:grid-cols-3">
      <Insight icon={ShieldCheck} title="دقة التوطين" tone={matched.length ? "good" : "warn"} text={matched.length ? `حددت ${matched.length} منطقة متوافقة مع نمط الحالة.` : "ابدأ بتحديد موضع العرض بدقة قبل صياغة التشخيص."} />
      <Insight icon={Microscope} title="نقاط تحتاج فحصًا" tone={missed.length <= 1 ? "good" : "warn"} text={missed.length ? `فكّر في تقييم: ${missed.slice(0, 3).map((r) => REGION_LABELS[r]).join("، ")}` : "التغطية التشريحية مناسبة للشكوى الحالية."} />
      <Insight icon={NotebookPen} title="جودة التبرير" tone={hasDiagnosis ? "good" : "warn"} text={hasDiagnosis ? "التشخيص مدعوم بتبرير قابل للمراجعة التعليمية." : "أضف مبررًا يربط التاريخ المرضي بموضع الأعراض والفحص."} />
    </div>
  );
}

function PatientPanel({ activeCase, expandedVisit, setExpandedVisit }: { activeCase: ClinicalCase; expandedVisit: string | null; setExpandedVisit: (id: string | null) => void }) {
  return (
    <aside className="space-y-4 2xl:sticky 2xl:top-28 2xl:h-[calc(100vh-8rem)] 2xl:overflow-y-auto">
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className={`bg-gradient-to-l ${activeCase.patient.avatarColor} px-5 py-5 text-white`}>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-black backdrop-blur">
              {activeCase.patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-bold opacity-90"><User2 className="h-4 w-4" />بيانات المريض</div>
              <div className="mt-1 text-xl font-black">{activeCase.patient.name}</div>
              <div className="mt-1 text-sm font-bold opacity-90">{activeCase.patient.age} سنة · {activeCase.patient.gender}</div>
              <div className="mt-2 inline-flex items-center gap-1 rounded-lg bg-white/20 px-2 py-1 text-xs font-black">رقم الملف: {activeCase.patient.mrn}</div>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3">
            <div className="mb-1 flex items-center gap-2 text-sm font-black text-destructive"><AlertCircle className="h-4 w-4" />الشكوى الرئيسية</div>
            <p className="text-base font-bold leading-relaxed text-foreground">{activeCase.chiefComplaint}</p>
          </div>
          <div className="grid grid-cols-5 gap-2">
            <Vital icon={Heart} value={activeCase.vitals.hr} label="نبض" />
            <Vital icon={Activity} value={activeCase.vitals.bp} label="ضغط" small />
            <Vital icon={Thermometer} value={activeCase.vitals.temp} label="حرارة" />
            <Vital icon={Wind} value={activeCase.vitals.rr} label="تنفس" />
            <Vital icon={Droplets} value={activeCase.vitals.spo2} label="O₂" />
          </div>
        </div>
      </section>

      <Section title="السجل الطبي" icon={FileText}>
        <RecordRow label="التاريخ المرضي" items={activeCase.pastMedicalHistory} />
        <RecordRow label="الأمراض المزمنة" items={activeCase.chronicDiseases} />
        <RecordRow label="الحساسية" items={activeCase.allergies} accent="rose" />
        <RecordRow label="الأدوية الحالية" items={activeCase.medications} icon={Pill} />
        <RecordRow label="تشخيصات سابقة" items={activeCase.previousDiagnoses} />
      </Section>

      <Section title="الزيارات السابقة" icon={History}>
        <div className="space-y-2">
          {activeCase.visits.map((v) => {
            const open = expandedVisit === v.id;
            return (
              <div key={v.id} className={`rounded-2xl border transition ${open ? "border-primary bg-accent/50" : "border-border bg-card"}`}>
                <button onClick={() => setExpandedVisit(open ? null : v.id)} className="flex w-full items-start justify-between gap-3 px-4 py-3 text-right">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-muted-foreground">{v.date}</span>
                      <span className="text-base font-black text-foreground">{v.reason}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-muted-foreground">{v.summary}</p>
                  </div>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
                </button>
                {open && <div className="border-t border-border px-4 py-3 text-sm font-medium leading-relaxed text-foreground">{v.details}</div>}
              </div>
            );
          })}
        </div>
      </Section>
    </aside>
  );
}

function ClinicalField({ label, value, onChange, placeholder, tall }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; tall?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-base font-black text-foreground">{label}</label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${tall ? "min-h-[130px]" : "min-h-[96px]"} resize-none text-base leading-relaxed`} />
    </div>
  );
}

function Insight({ icon: Icon, title, text, tone }: { icon: typeof ShieldCheck; title: string; text: string; tone: "good" | "warn" }) {
  return (
    <div className={`rounded-2xl border p-4 ${tone === "good" ? "border-emerald-500/20 bg-emerald-500/5" : "border-amber-500/25 bg-amber-500/5"}`}>
      <div className={`mb-2 flex items-center gap-2 text-sm font-black ${tone === "good" ? "text-emerald-700" : "text-amber-700"}`}><Icon className="h-4 w-4" />{title}</div>
      <p className="text-sm font-semibold leading-relaxed text-foreground">{text}</p>
    </div>
  );
}

function Vital({ icon: Icon, value, label, small }: { icon: typeof Heart; value: string; label: string; small?: boolean }) {
  return (
    <div className="flex min-h-20 flex-col items-center justify-center rounded-2xl border border-border bg-muted/60 px-1 py-2 text-center">
      <Icon className="h-4 w-4 text-primary" />
      <div className={`mt-1 font-black text-foreground ${small ? "text-xs" : "text-sm"}`}>{value}</div>
      <div className="text-xs font-bold text-muted-foreground">{label}</div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: typeof FileText; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-black text-foreground">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function RecordRow({ label, items, accent, icon: Icon }: { label: string; items: string[]; accent?: "rose"; icon?: typeof Pill }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-sm font-black text-muted-foreground">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((it, i) => (
          <span key={i} className={`rounded-xl border px-3 py-1.5 text-sm font-bold ${accent === "rose" ? "border-destructive/20 bg-destructive/5 text-destructive" : "border-border bg-muted text-foreground"}`}>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-3 py-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}
