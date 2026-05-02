import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Activity, AlertTriangle, ArrowLeft, Award, Brain, CheckCircle2, ChevronLeft, ClipboardCheck, Circle, Clock,
  Droplets, FileText, FlaskConical, Gauge, HeartPulse, Home, ImageIcon, Info, Lightbulb, Loader2, MessageSquareText, NotebookPen, Pill,
  Save, Send, ShieldAlert, Star, Stethoscope, Target, Thermometer, Wind, XCircle,
} from "lucide-react";
import { BodyMap } from "@/components/examination/BodyMap";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth-context";
import { getLearningCase } from "@/data/case-flow";
import { REGION_LABELS, SEVERITY_OPTIONS, SYMPTOM_OPTIONS, type BodyRegionId, type Severity, type SymptomType } from "@/data/clinical-cases";
import {
  getCaseChecklistData, matchesAny, CATEGORY_LABELS,
  type ChecklistCategory, type ChecklistItem, type InvestigationEntry, type LabRow,
} from "@/data/case-checklist";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/case/$caseId")({
  component: CaseJourneyPage,
  head: () => ({ meta: [{ title: "رحلة الحالة السريرية — مدسم" }] }),
});

type StageId = "interview" | "exam" | "investigations" | "diagnosis" | "treatment" | "feedback";
type Message = { role: "user" | "assistant"; content: string };
type Finding = { region: BodyRegionId; severity: Severity; symptom: SymptomType; notes: string; feedback: string; status: "correct" | "close" | "wrong" };
type RequestedInvestigation = { entry: InvestigationEntry; requestedText: string };
type RequestLogEntry = { id: string; text: string; status: "accepted" | "unnecessary" | "unknown"; message: string };

const STAGES: Array<{ id: StageId; title: string; icon: typeof MessageSquareText }> = [
  { id: "interview", title: "مقابلة المريض", icon: MessageSquareText },
  { id: "exam", title: "الفحص السريري", icon: Stethoscope },
  { id: "investigations", title: "طلب الفحوصات", icon: FlaskConical },
  { id: "diagnosis", title: "التشخيص", icon: Brain },
  { id: "treatment", title: "الخطة العلاجية", icon: Pill },
  { id: "feedback", title: "التقييم النهائي", icon: ClipboardCheck },
];

const TIMER_SECONDS = 10 * 60;

function CaseJourneyPage() {
  const { caseId } = Route.useParams();
  const clinicalCase = getLearningCase(caseId);
  const checklistData = getCaseChecklistData(caseId);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [stage, setStage] = useState<StageId>("interview");
  const [submitted, setSubmitted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [interviewNotes, setInterviewNotes] = useState<string[]>([]);
  const [bodyView, setBodyView] = useState<"front" | "back">("front");
  const [findings, setFindings] = useState<Finding[]>([]);
  const [investigationInput, setInvestigationInput] = useState("");
  const [requestedInvestigations, setRequestedInvestigations] = useState<RequestedInvestigation[]>([]);
  const [requestLog, setRequestLog] = useState<RequestLogEntry[]>([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [differentials, setDifferentials] = useState("");
  const [justification, setJustification] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [completedChecklist, setCompletedChecklist] = useState<Set<string>>(new Set());
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [timeUp, setTimeUp] = useState(false);
  const warnedFiveRef = useRef(false);
  const warnedOneRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (clinicalCase && messages.length === 0) {
      setMessages([{ role: "assistant", content: `السلام عليكم دكتور… ${clinicalCase.chiefComplaint}.` }]);
    }
  }, [clinicalCase, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Timer
  useEffect(() => {
    if (stage === "feedback" || timeUp) return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (next === 5 * 60 && !warnedFiveRef.current) {
          warnedFiveRef.current = true;
          toast.warning("تبقى ٥ دقائق على انتهاء الوقت");
        }
        if (next === 60 && !warnedOneRef.current) {
          warnedOneRef.current = true;
          toast.warning("تبقى دقيقة واحدة");
        }
        if (next <= 0) {
          clearInterval(id);
          setTimeUp(true);
          setSubmitted(true);
          toast.error("انتهى الوقت — سيتم نقلك للتقييم النهائي");
          setStage("feedback");
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [stage, timeUp]);

  // Mark checklist items based on selected exam regions
  useEffect(() => {
    if (!checklistData) return;
    const regionIds = findings.map((f) => f.region);
    if (!regionIds.length) return;
    setCompletedChecklist((prev) => {
      const next = new Set(prev);
      checklistData.checklist.forEach((item) => {
        if (item.category !== "exam") return;
        if (item.keywords.some((k) => regionIds.includes(k as BodyRegionId))) next.add(item.id);
      });
      return next;
    });
  }, [findings, checklistData]);

  const markChecklistByText = useCallback((text: string, category: ChecklistCategory | ChecklistCategory[]) => {
    if (!checklistData) return;
    const cats = Array.isArray(category) ? category : [category];
    setCompletedChecklist((prev) => {
      const next = new Set(prev);
      checklistData.checklist.forEach((item) => {
        if (!cats.includes(item.category)) return;
        if (next.has(item.id)) return;
        if (matchesAny(text, item.keywords)) next.add(item.id);
      });
      return next;
    });
  }, [checklistData]);

  // Re-evaluate diagnosis & treatment checklist whenever those fields change
  useEffect(() => {
    if (!checklistData) return;
    const blob = `${diagnosis} ${differentials} ${justification}`;
    markChecklistByText(blob, "diagnosis");
  }, [diagnosis, differentials, justification, checklistData, markChecklistByText]);

  useEffect(() => {
    markChecklistByText(treatmentPlan, "treatment");
  }, [treatmentPlan, markChecklistByText]);

  const selectedRegions = useMemo(() => findings.map((item) => item.region), [findings]);

  const checklistByCategory = useMemo(() => {
    const map: Record<ChecklistCategory, ChecklistItem[]> = { history: [], exam: [], investigations: [], diagnosis: [], treatment: [] };
    checklistData?.checklist.forEach((item) => map[item.category].push(item));
    return map;
  }, [checklistData]);

  const completedCount = checklistData?.checklist.filter((i) => completedChecklist.has(i.id)).length ?? 0;
  const totalChecklist = checklistData?.checklist.length ?? 0;

  // ===== Final scoring — all criteria out of 10 =====
  const scoreBreakdown = useMemo(() => {
    if (!checklistData) return { interview: 0, exam: 0, investigations: 0, diagnosis: 0, treatment: 0, time: 0, total: 0 };
    const cl = checklistData.checklist;
    const cat = (c: ChecklistCategory) => {
      const items = cl.filter((i) => i.category === c);
      const done = items.filter((i) => completedChecklist.has(i.id)).length;
      return items.length ? done / items.length : 0;
    };
    const interview = Math.round(cat("history") * 10);
    const exam = Math.round(cat("exam") * 10);
    const usefulRequested = requestedInvestigations.filter((r) => r.entry.useful).length;
    const unnecessaryRequested = requestedInvestigations.filter((r) => !r.entry.useful).length;
    const usefulTotal = checklistData.investigationCatalog.filter((e) => e.useful).length || 1;
    const investigations = Math.max(0, Math.min(10, Math.round((usefulRequested / usefulTotal) * 10 - unnecessaryRequested * 2)));
    const diagnosisHit = matchesAny(diagnosis, checklistData.expectedDiagnosisKeywords);
    const diagnosisScore = (diagnosisHit ? 7 : 2) + (justification.trim().length > 20 ? 3 : 0);
    const treatmentHit = matchesAny(treatmentPlan, checklistData.expectedTreatmentKeywords);
    const treatment = treatmentHit ? 10 : treatmentPlan.trim().length > 10 ? 4 : 0;
    const time = Math.round((secondsLeft / TIMER_SECONDS) * 10);
    const avg = Math.round((interview + exam + investigations + Math.min(10, diagnosisScore) + Math.min(10, treatment) + Math.min(10, time)) / 6);
    const total = Math.min(10, avg);
    return { interview, exam, investigations, diagnosis: Math.min(10, diagnosisScore), treatment: Math.min(10, treatment), time: Math.min(10, time), total };
  }, [checklistData, completedChecklist, requestedInvestigations, diagnosis, justification, treatmentPlan, secondsLeft]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  }

  if (!clinicalCase || !checklistData) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
          <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-4 text-2xl font-black">الحالة غير موجودة</h1>
          <Link to="/clinical-cases" className="mt-5 inline-flex rounded-2xl bg-primary px-5 py-3 font-bold text-primary-foreground">العودة للحالات</Link>
        </div>
      </DashboardLayout>
    );
  }

  const moveTo = (next: StageId) => {
    if (next === "feedback" && !submitted) {
      toast.warning(t("case.submit.locked"));
      return;
    }
    setStage(next);
  };
  const saveProgress = () => toast.success("تم حفظ تقدمك التعليمي داخل هذه الحالة");
  const submitCase = () => {
    if (submitted) { setStage("feedback"); return; }
    setSubmitted(true);
    setStage("feedback");
    toast.success(t("case.submit.confirm"));
  };

  const sendQuestion = async (event: FormEvent) => {
    event.preventDefault();
    const text = question.trim();
    if (!text || streaming || timeUp) return;
    const userMessage: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setQuestion("");
    setInterviewNotes((prev) => Array.from(new Set([...prev, text])));
    markChecklistByText(text, "history");
    setStreaming(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/patient-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: nextMessages, caseInfo: clinicalCase }),
      });
      if (!response.ok || !response.body) throw new Error("patient chat unavailable");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nextLine: number;
        while ((nextLine = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, nextLine).trim();
          buffer = buffer.slice(nextLine + 1);
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") break;
          try {
            const parsed = JSON.parse(payload);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              answer += delta;
              setMessages((prev) => prev.map((msg, index) => index === prev.length - 1 ? { role: "assistant", content: answer } : msg));
            }
          } catch { continue; }
        }
      }
    } catch {
      const fallback = buildPatientReply(text, clinicalCase.chiefComplaint);
      setMessages([...nextMessages, { role: "assistant", content: fallback }]);
    } finally {
      setStreaming(false);
    }
  };

  const toggleRegion = (region: BodyRegionId) => {
    if (timeUp) return;
    const exists = findings.some((item) => item.region === region);
    if (exists) {
      setFindings((prev) => prev.filter((item) => item.region !== region));
      return;
    }
    const status = clinicalCase.expectedRegions.includes(region) ? "correct" : clinicalCase.closeRegions.includes(region) ? "close" : "wrong";
    const feedback = status === "correct" ? "موضع ملائم للحالة" : status === "close" ? "قريب — حاول الدقة أكثر" : "موضع غير متوافق";
    setFindings((prev) => [...prev, { region, severity: "moderate", symptom: "pain", notes: "", feedback, status }]);
  };

  const updateFinding = (region: BodyRegionId, patch: Partial<Finding>) => {
    setFindings((prev) => prev.map((item) => item.region === region ? { ...item, ...patch } : item));
  };

  const submitInvestigationRequest = (event: FormEvent) => {
    event.preventDefault();
    const text = investigationInput.trim();
    if (!text || timeUp) return;
    setInvestigationInput("");
    const matched = checklistData.investigationCatalog.find((entry) =>
      entry.aliases.some((a) => matchesAny(text, [a])) || matchesAny(text, [entry.label]),
    );
    const id = `${Date.now()}`;
    if (!matched) {
      setRequestLog((prev) => [...prev, { id, text, status: "unknown", message: "لم يتم التعرف على هذا الفحص — جرّب صياغة أخرى." }]);
      return;
    }
    if (requestedInvestigations.some((r) => r.entry.id === matched.id)) {
      setRequestLog((prev) => [...prev, { id, text, status: matched.useful ? "accepted" : "unnecessary", message: "سبق طلب هذا الفحص — راجع نتيجته بالأسفل." }]);
      return;
    }
    setRequestedInvestigations((prev) => [...prev, { entry: matched, requestedText: text }]);
    markChecklistByText(text, "investigations");
    if (matched.useful) {
      setRequestLog((prev) => [...prev, { id, text, status: "accepted", message: `تم قبول الطلب: ${matched.label} مناسب لهذه الحالة.` }]);
    } else {
      setRequestLog((prev) => [...prev, { id, text, status: "unnecessary", message: `${matched.label}: ${matched.rationale}` }]);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timerCritical = secondsLeft <= 60;
  const timerWarning = secondsLeft <= 5 * 60 && !timerCritical;

  return (
    <DashboardLayout>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-muted-foreground">
          <Link to="/dashboard" className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 transition hover:text-foreground"><Home className="h-4 w-4" /> الرئيسية</Link>
          <span>/</span>
          <Link to="/clinical-cases" className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 transition hover:text-foreground"><ArrowLeft className="h-4 w-4 rotate-180" /> الحالات السريرية</Link>
          <span>/</span>
          <span className="text-primary">{clinicalCase.patient.name}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={saveProgress} className="h-11 gap-2 font-black"><Save className="h-4 w-4" /> حفظ التقدم</Button>
          <Button onClick={submitCase} disabled={submitted} className="h-11 gap-2 bg-[image:var(--gradient-primary)] font-black text-primary-foreground shadow-[var(--shadow-soft)]">
            <ClipboardCheck className="h-4 w-4" /> {submitted ? t("case.submit.confirm") : t("case.submit")}
          </Button>
        </div>
      </div>

      {/* Patient bar with timer */}
      <section className="sticky top-16 z-20 mb-5 rounded-3xl border border-border bg-card/95 p-5 shadow-[var(--shadow-card)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-xl font-black text-primary-foreground ${clinicalCase.patient.avatarColor}`}>{clinicalCase.patient.name.charAt(0)}</div>
            <div>
              <h1 className="text-2xl font-black text-foreground">{clinicalCase.patient.name}</h1>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold text-muted-foreground">
                <span>{clinicalCase.patient.age} سنة</span><span>{clinicalCase.patient.gender}</span><span>رقم الملف: {clinicalCase.patient.mrn}</span>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-3 rounded-2xl border-2 px-5 py-3 font-black tabular-nums transition-colors ${timeUp ? "border-destructive bg-destructive/10 text-destructive" : timerCritical ? "border-destructive bg-destructive/10 text-destructive animate-pulse" : timerWarning ? "border-amber-500 bg-amber-50 text-amber-700" : "border-primary/30 bg-primary/5 text-primary"}`}>
            <Clock className="h-6 w-6" />
            <div className="text-right leading-tight">
              <div className="text-[11px] font-bold uppercase tracking-wide opacity-80">{timeUp ? "انتهى الوقت" : "الوقت المتبقي"}</div>
              <div className="text-3xl">{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</div>
            </div>
          </div>

          <div className="grid flex-1 gap-3 md:grid-cols-3">
            <PatientFact label="الشكوى الرئيسية" value={clinicalCase.chiefComplaint} />
            <PatientFact label="الأمراض المزمنة" value={clinicalCase.chronicDiseases.join("، ") || "لا توجد"} />
            <PatientFact label="الحساسية" value={clinicalCase.allergies.join("، ") || "لا توجد"} />
          </div>
        </div>

        {/* Vital signs */}
        <div className="mt-5 rounded-3xl border border-primary/20 bg-[image:var(--gradient-soft)] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-primary">
            <Activity className="h-5 w-5" /> {t("vitals.title")}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <VitalCell icon="temp" label={t("vitals.temp")} value={`${clinicalCase.vitals.temp}°C`} status={vitalStatus("temp", clinicalCase.vitals.temp)} />
            <VitalCell icon="hr" label={t("vitals.hr")} value={`${clinicalCase.vitals.hr} bpm`} status={vitalStatus("hr", clinicalCase.vitals.hr)} />
            <VitalCell icon="bp" label={t("vitals.bp")} value={`${clinicalCase.vitals.bp} mmHg`} status={vitalStatus("bp", clinicalCase.vitals.bp)} />
            <VitalCell icon="rr" label={t("vitals.rr")} value={`${clinicalCase.vitals.rr} /min`} status={vitalStatus("rr", clinicalCase.vitals.rr)} />
            <VitalCell icon="spo2" label={t("vitals.spo2")} value={clinicalCase.vitals.spo2} status={vitalStatus("spo2", clinicalCase.vitals.spo2)} />
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between text-xs font-black text-muted-foreground">
            <span>مسار الحالة</span>
            <span>{completedCount} / {totalChecklist} عنصر تم تقييمه</span>
          </div>
          <Progress value={(completedCount / Math.max(1, totalChecklist)) * 100} className="mb-4 h-2" />
          <div className="grid gap-2 md:grid-cols-6">
            {STAGES.map((item, index) => {
              const Icon = item.icon;
              const active = item.id === stage;
              return (
                <button key={item.id} onClick={() => moveTo(item.id)} className={`rounded-2xl border px-3 py-3 text-right transition ${active ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "border-border bg-muted/60 text-muted-foreground hover:bg-muted"}`}>
                  <Icon className="mb-2 h-5 w-5" />
                  <div className="text-sm font-black leading-tight">{index + 1}. {item.title}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERVIEW */}
      {stage === "interview" && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="border-b border-border p-5">
              <h2 className="flex items-center gap-2 text-2xl font-black"><MessageSquareText className="h-6 w-6 text-primary" /> {t("interview.title")}</h2>
              <p className="mt-1 text-base text-muted-foreground">{t("interview.desc")}</p>
            </div>
            <div ref={scrollRef} className="h-[440px] space-y-4 overflow-y-auto p-5">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[78%] rounded-3xl px-5 py-4 text-base leading-relaxed shadow-sm ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    {message.content || <Loader2 className="h-5 w-5 animate-spin" />}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={sendQuestion} className="border-t border-border p-5">
              <div className="flex gap-3">
                <Input value={question} onChange={(event) => setQuestion(event.target.value)} disabled={timeUp} className="h-12 text-base" placeholder={t("interview.placeholder")} />
                <Button disabled={streaming || timeUp} className="h-12 gap-2 px-6 font-black"><Send className="h-4 w-4" /> {t("interview.send")}</Button>
              </div>
            </form>
          </section>

          <aside className="space-y-5 xl:sticky xl:top-[100px] xl:self-start">
            <ChecklistPanel checklistByCategory={checklistByCategory} completed={completedChecklist} />
            <ClinicalCard title={t("interview.notes")} icon={NotebookPen}>
              <div className="space-y-2">
                {interviewNotes.length ? interviewNotes.slice(-5).map((note) => <div key={note} className="rounded-2xl bg-muted p-3 text-sm font-bold">{note}</div>) : <EmptyText text={t("interview.notes.empty")} />}
              </div>
            </ClinicalCard>
            <Button onClick={() => moveTo("exam")} className="h-12 w-full gap-2 bg-[image:var(--gradient-primary)] text-base font-black shadow-[var(--shadow-soft)]">{t("interview.next")} <ChevronLeft className="h-5 w-5" /></Button>
          </aside>
        </div>
      )}

      {/* EXAM */}
      {stage === "exam" && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="text-2xl font-black">حدد موضع الأعراض بدقة</h2><p className="text-base text-muted-foreground">اختر منطقة صغيرة كما تفعل في فحص سريري حقيقي.</p></div>
              <div className="flex rounded-2xl border border-border bg-muted p-1.5">
                <button onClick={() => setBodyView("front")} className={`rounded-xl px-5 py-2.5 font-black ${bodyView === "front" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>عرض أمامي</button>
                <button onClick={() => setBodyView("back")} className={`rounded-xl px-5 py-2.5 font-black ${bodyView === "back" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>عرض خلفي</button>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-gradient-to-b from-accent/70 to-card px-4 py-6">
              <BodyMap view={bodyView} selected={selectedRegions} expectedRegions={clinicalCase.expectedRegions} onToggle={toggleRegion} />
            </div>
          </section>
          <aside className="space-y-5">
            <ChecklistPanel checklistByCategory={checklistByCategory} completed={completedChecklist} />
            <ClinicalCard title="المناطق المحددة" icon={Target}>
              {findings.length === 0 ? <EmptyText text="انقر على موضع الألم أو العرض في الجسم." /> : <div className="space-y-3">{findings.map((finding) => (
                <div key={finding.region} className="rounded-2xl border border-border bg-muted/45 p-4">
                  <div className="mb-3 flex items-center justify-between gap-2"><div className="font-black">{REGION_LABELS[finding.region]}</div><StatusBadge status={finding.status} text={finding.feedback} /></div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <select value={finding.symptom} onChange={(event) => updateFinding(finding.region, { symptom: event.target.value as SymptomType })} className="h-11 rounded-xl border border-input bg-card px-3 text-sm font-bold">
                      {SYMPTOM_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    <select value={finding.severity} onChange={(event) => updateFinding(finding.region, { severity: event.target.value as Severity })} className="h-11 rounded-xl border border-input bg-card px-3 text-sm font-bold">
                      {SEVERITY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </div>
                  <Textarea value={finding.notes} onChange={(event) => updateFinding(finding.region, { notes: event.target.value })} className="mt-3 min-h-20" placeholder="ملاحظات الطبيب…" />
                </div>
              ))}</div>}
            </ClinicalCard>
            <Button onClick={() => moveTo("investigations")} className="h-12 w-full gap-2 font-black">الانتقال لطلب الفحوصات <ChevronLeft className="h-5 w-5" /></Button>
          </aside>
        </div>
      )}

      {/* INVESTIGATIONS — manual request only */}
      {stage === "investigations" && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="mb-5">
              <h2 className="flex items-center gap-2 text-2xl font-black"><FlaskConical className="h-6 w-6 text-primary" /> اطلب فحصًا أو أشعة</h2>
              <p className="mt-1 text-base text-muted-foreground">اكتب يدويًا اسم الفحص الذي تريد طلبه. مثال: <span className="font-black text-foreground">أحتاج أشعة صدر</span> — <span className="font-black text-foreground">أطلب CBC</span> — <span className="font-black text-foreground">أحتاج ECG</span>.</p>
            </div>
            <form onSubmit={submitInvestigationRequest} className="mb-5 flex gap-3">
              <Input value={investigationInput} onChange={(e) => setInvestigationInput(e.target.value)} disabled={timeUp} className="h-12 text-base" placeholder="اكتب الفحص المطلوب…" />
              <Button disabled={timeUp} className="h-12 gap-2 px-6 font-black"><Send className="h-4 w-4" /> إرسال الطلب</Button>
            </form>

            {requestLog.length > 0 && (
              <div className="mb-5 space-y-2">
                {requestLog.slice().reverse().slice(0, 5).map((log) => (
                  <div key={log.id} className={`flex items-start gap-2 rounded-2xl border p-3 text-sm font-bold ${log.status === "accepted" ? "border-primary/30 bg-primary/5 text-foreground" : log.status === "unnecessary" ? "border-amber-500/40 bg-amber-50 text-amber-900" : "border-destructive/30 bg-destructive/5 text-destructive"}`}>
                    {log.status === "accepted" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> : log.status === "unnecessary" ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" />}
                    <div><div className="font-black">{log.text}</div><div className="text-xs font-medium opacity-90">{log.message}</div></div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-black text-foreground">نتائج الفحوصات</h3>
              {requestedInvestigations.length === 0 ? (
                <EmptyText text="لا توجد نتائج بعد — اطلب فحصًا لتظهر نتيجته." />
              ) : (
                requestedInvestigations.map((req) => <ResultCard key={req.entry.id} entry={req.entry} />)
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => moveTo("diagnosis")} className="h-12 gap-2 font-black">الانتقال للتشخيص <ChevronLeft className="h-5 w-5" /></Button>
            </div>
          </section>
          <aside className="space-y-5">
            <ChecklistPanel checklistByCategory={checklistByCategory} completed={completedChecklist} />
          </aside>
        </div>
      )}

      {/* DIAGNOSIS — no automatic hints */}
      {stage === "diagnosis" && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-2 flex items-center gap-2 text-2xl font-black"><Brain className="h-6 w-6 text-primary" /> التشخيص المتوقع</h2>
            <p className="mb-5 text-base text-muted-foreground">اكتب تشخيصك بناءً على القصة والفحص ونتائج الفحوصات التي طلبتها. لن تُعرض الإجابة الصحيحة الآن.</p>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-black text-foreground">التشخيص الأكثر احتمالًا</label>
                <Input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} disabled={timeUp} className="h-12 text-base" placeholder="مثال: التهاب الزائدة الدودية الحاد" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-black text-foreground">التشخيصات التفريقية</label>
                <Textarea value={differentials} onChange={(e) => setDifferentials(e.target.value)} disabled={timeUp} className="min-h-24 text-base" placeholder="اذكر تشخيصات أخرى محتملة وسبب استبعادها…" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-black text-foreground">مبرر التشخيص</label>
                <Textarea value={justification} onChange={(e) => setJustification(e.target.value)} disabled={timeUp} className="min-h-28 text-base" placeholder="اربط القصة بالفحص وبنتائج الفحوصات…" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => moveTo("treatment")} className="h-12 gap-2 font-black">الانتقال للخطة العلاجية <ChevronLeft className="h-5 w-5" /></Button>
            </div>
          </section>
          <aside className="space-y-5">
            <ChecklistPanel checklistByCategory={checklistByCategory} completed={completedChecklist} />
          </aside>
        </div>
      )}

      {/* TREATMENT */}
      {stage === "treatment" && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="mb-2 flex items-center gap-2 text-2xl font-black"><Pill className="h-6 w-6 text-primary" /> الخطة العلاجية / الخطوة التالية</h2>
            <p className="mb-5 text-base text-muted-foreground">اقترح الخطة العلاجية أو الإجراء التالي بصيغتك. هذه محاكاة تعليمية وليست توصية لمرضى حقيقيين.</p>
            <Textarea value={treatmentPlan} onChange={(e) => setTreatmentPlan(e.target.value)} disabled={timeUp} className="min-h-40 text-base" placeholder="مثال: إحالة جراحية عاجلة، صيام، مسكنات مناسبة، وسوائل وريدية…" />
            <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm font-bold leading-relaxed text-foreground">
              <div className="mb-1 flex items-center gap-2 text-xs font-black text-primary"><Info className="h-4 w-4" /> {t("about.disclaimerTitle")}</div>
              {t("case.aiNotice")}
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={submitCase} className="h-12 gap-2 bg-[image:var(--gradient-primary)] font-black"><ClipboardCheck className="h-5 w-5" /> {t("case.submit")}</Button>
            </div>
          </section>
          <aside className="space-y-5">
            <ChecklistPanel checklistByCategory={checklistByCategory} completed={completedChecklist} />
          </aside>
        </div>
      )}

      {/* FEEDBACK */}
      {stage === "feedback" && (
        <FeedbackSection
          score={scoreBreakdown}
          timeUp={timeUp}
          checklistData={checklistData}
          completed={completedChecklist}
          requestedInvestigations={requestedInvestigations}
          findings={findings}
          clinicalCase={clinicalCase}
          diagnosis={diagnosis}
          treatmentPlan={treatmentPlan}
          onBack={() => navigate({ to: "/clinical-cases" })}
          onHome={() => navigate({ to: "/dashboard" })}
        />
      )}
    </DashboardLayout>
  );
}

// ============== Sub-components ==============

function ChecklistPanel({ checklistByCategory, completed }: { checklistByCategory: Record<ChecklistCategory, ChecklistItem[]>; completed: Set<string> }) {
  const categories: ChecklistCategory[] = ["history", "exam", "investigations", "diagnosis", "treatment"];
  return (
    <ClinicalCard title="قائمة التحقق" icon={ClipboardCheck}>
      <div className="space-y-2">
        {categories.map((cat) => {
          const items = checklistByCategory[cat];
          const done = items.filter((i) => completed.has(i.id)).length;
          const ratio = items.length ? done / items.length : 0;
          return (
            <div key={cat} className="rounded-2xl border border-border bg-muted/40 p-3">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-black text-foreground">{CATEGORY_LABELS[cat]}</span>
                <span className={`text-xs font-black ${done === items.length && items.length > 0 ? "text-primary" : "text-muted-foreground"}`}>
                  {done === items.length && items.length > 0 ? "تم إنجازها" : `${done} / ${items.length} • قيد التقييم`}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-card">
                <div className="h-full bg-primary transition-all" style={{ width: `${ratio * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs font-bold text-muted-foreground">سيتم كشف العناصر التفصيلية في التقييم النهائي.</p>
    </ClinicalCard>
  );
}

function ResultCard({ entry }: { entry: InvestigationEntry }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3 border-b border-border bg-primary/5 px-5 py-3">
        {entry.result.kind === "lab" ? <FlaskConical className="h-5 w-5 text-primary" /> : entry.result.kind === "imaging" ? <ImageIcon className="h-5 w-5 text-primary" /> : <Activity className="h-5 w-5 text-primary" />}
        <div className="flex-1"><div className="text-xs font-black text-primary">نتيجة الفحص</div><div className="text-base font-black text-foreground">{entry.result.title}</div></div>
        {entry.useful ? <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">طلب مناسب</span> : <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">قابل للنقاش</span>}
      </div>
      <div className="p-5">
        {entry.result.kind === "lab" && <LabResult rows={entry.result.rows} interpretation={entry.result.interpretation} />}
        {entry.result.kind === "imaging" && <ImagingResult modality={entry.result.modality} impression={entry.result.impression} notes={entry.result.notes} />}
        {entry.result.kind === "ecg" && <EcgResult rhythm={entry.result.rhythm} rate={entry.result.rate} impression={entry.result.impression} notes={entry.result.notes} />}
      </div>
    </div>
  );
}

function LabResult({ rows, interpretation }: { rows: LabRow[]; interpretation: string }) {
  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs font-black text-muted-foreground"><tr><th className="px-3 py-2 text-right">الفحص</th><th className="px-3 py-2 text-right">النتيجة</th><th className="px-3 py-2 text-right">المعدل الطبيعي</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-border">
                <td className="px-3 py-2 font-bold">{r.name}</td>
                <td className={`px-3 py-2 font-black ${r.flag === "high" ? "text-destructive" : r.flag === "low" ? "text-amber-700" : "text-foreground"}`}>
                  {r.value}{r.flag === "high" ? " ↑" : r.flag === "low" ? " ↓" : ""}
                </td>
                <td className="px-3 py-2 text-muted-foreground">{r.range}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 rounded-2xl bg-muted/50 p-3 text-sm font-bold"><span className="text-primary">قراءة مبدئية:</span> {interpretation}</div>
    </div>
  );
}

function ImagingResult({ modality, impression, notes }: { modality: string; impression: string; notes: string }) {
  return (
    <div>
      <div className="flex h-44 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-center">
        <div className="text-slate-200">
          <ImageIcon className="mx-auto h-10 w-10 opacity-70" />
          <div className="mt-2 text-sm font-black">صورة الأشعة — {modality}</div>
          <div className="text-xs opacity-70">عرض تعليمي</div>
        </div>
      </div>
      <div className="mt-3 space-y-2 text-sm">
        <div className="rounded-2xl bg-muted/50 p-3 font-bold"><span className="text-primary">الانطباع:</span> {impression}</div>
        <div className="rounded-2xl bg-muted/30 p-3 font-bold text-muted-foreground"><span className="text-primary">ملاحظات سريرية:</span> {notes}</div>
      </div>
    </div>
  );
}

function EcgResult({ rhythm, rate, impression, notes }: { rhythm: string; rate: string; impression: string; notes: string }) {
  return (
    <div>
      <div className="rounded-2xl border border-border bg-emerald-950 p-4">
        <svg viewBox="0 0 400 80" className="h-20 w-full text-emerald-400">
          <path d="M0 40 L40 40 L48 20 L56 60 L64 30 L72 50 L80 40 L120 40 L128 25 L136 55 L144 40 L200 40 L208 18 L216 62 L224 32 L232 48 L240 40 L300 40 L308 22 L316 58 L324 40 L400 40" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-black text-emerald-200">
          <div>Rhythm: <span className="text-emerald-100">{rhythm}</span></div>
          <div>Rate: <span className="text-emerald-100">{rate}</span></div>
        </div>
      </div>
      <div className="mt-3 space-y-2 text-sm">
        <div className="rounded-2xl bg-muted/50 p-3 font-bold"><span className="text-primary">الانطباع:</span> {impression}</div>
        <div className="rounded-2xl bg-muted/30 p-3 font-bold text-muted-foreground"><span className="text-primary">ملاحظات سريرية:</span> {notes}</div>
      </div>
    </div>
  );
}

function FeedbackSection({
  score, timeUp, checklistData, completed, requestedInvestigations, findings, clinicalCase, diagnosis, treatmentPlan, onBack, onHome,
}: {
  score: { interview: number; exam: number; investigations: number; diagnosis: number; treatment: number; time: number; total: number };
  timeUp: boolean;
  checklistData: ReturnType<typeof getCaseChecklistData> & object;
  completed: Set<string>;
  requestedInvestigations: RequestedInvestigation[];
  findings: Finding[];
  clinicalCase: NonNullable<ReturnType<typeof getLearningCase>>;
  diagnosis: string;
  treatmentPlan: string;
  onBack: () => void;
  onHome: () => void;
}) {
  const { t } = useI18n();
  const cl = checklistData!.checklist;
  const completedItems = cl.filter((i) => completed.has(i.id));
  const missedItems = cl.filter((i) => !completed.has(i.id));
  const usefulCatalog = checklistData!.investigationCatalog.filter((e) => e.useful);
  const requestedIds = new Set(requestedInvestigations.map((r) => r.entry.id));
  const missedUseful = usefulCatalog.filter((e) => !requestedIds.has(e.id));
  const requestedUnnecessary = requestedInvestigations.filter((r) => !r.entry.useful);
  const requestedUseful = requestedInvestigations.filter((r) => r.entry.useful);
  const correctRegions = findings.filter((f) => f.status === "correct").length;
  const diagnosisHit = matchesAny(diagnosis, checklistData!.expectedDiagnosisKeywords);
  const scoreOutOf10 = Math.round(score.total / 10);

  return (
    <section className="space-y-5">
      {/* Header with score */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <h2 className="text-3xl font-black">{t("fb.title")}</h2>
            <p className="mt-1 text-base text-muted-foreground">{timeUp ? t("fb.subTime") : t("fb.sub")}</p>
          </div>
          <div className="flex items-center gap-5">
            <div className="rounded-3xl bg-[image:var(--gradient-primary)] px-7 py-5 text-center text-primary-foreground shadow-[var(--shadow-soft)]">
              <div className="text-sm font-bold">{t("fb.scoreOutOf10")}</div>
              <div className="text-5xl font-black leading-none tabular-nums">{scoreOutOf10}<span className="text-2xl font-extrabold opacity-80">/10</span></div>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 px-5 py-4 text-center">
              <div className="text-xs font-bold text-muted-foreground">{t("fb.final")}</div>
              <div className="text-2xl font-black tabular-nums text-foreground">{score.total}<span className="text-sm font-bold text-muted-foreground">/100</span></div>
            </div>
          </div>
        </div>

        {/* Score breakdown chips */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <ScoreChip label={t("fb.s.interview")} value={score.interview} max={25} />
          <ScoreChip label={t("fb.s.exam")} value={score.exam} max={15} />
          <ScoreChip label={t("fb.s.inv")} value={score.investigations} max={25} />
          <ScoreChip label={t("fb.s.dx")} value={score.diagnosis} max={20} />
          <ScoreChip label={t("fb.s.tx")} value={score.treatment} max={10} />
          <ScoreChip label={t("fb.s.time")} value={score.time} max={5} />
        </div>
      </div>

      {/* Diagnosis accuracy */}
      <div className={`rounded-3xl border p-5 shadow-[var(--shadow-card)] ${diagnosisHit ? "border-primary/30 bg-primary/5" : "border-amber-400/30 bg-amber-50/60 dark:bg-amber-950/20"}`}>
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${diagnosisHit ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
            <Target className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-black text-muted-foreground">{t("fb.diagAccuracy")}</div>
            <div className={`text-lg font-black ${diagnosisHit ? "text-primary" : "text-amber-700 dark:text-amber-400"}`}>
              {diagnosisHit ? t("fb.diagAccuracy.hit") : t("fb.diagAccuracy.miss")}
            </div>
          </div>
        </div>
        {!diagnosisHit && (
          <p className="mt-3 text-sm font-bold text-foreground">
            {t("fb.dxEval.expected", { d: clinicalCase.correctDiagnosis })}
          </p>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* What student did right */}
        <FeedbackCard title={t("fb.whatRight")} icon={CheckCircle2} positive items={[
          ...(completedItems.length ? completedItems.map((i) => i.label) : [t("fb.good.opened")]),
          correctRegions ? t("fb.good.regions", { n: correctRegions }) : "",
          requestedUseful.length ? t("fb.good.invs", { n: requestedUseful.length }) : "",
          diagnosisHit ? t("fb.good.dx", { d: diagnosis }) : "",
        ].filter(Boolean)} />

        {/* Missed steps */}
        <FeedbackCard title={t("fb.whatMissed")} icon={Circle} items={
          missedItems.length ? missedItems.map((i) => `${CATEGORY_LABELS[i.category]} — ${i.label}`) : [t("fb.missed.allDone")]
        } />

        {/* Appropriate tests */}
        <FeedbackCard title={t("fb.appropriateTests")} icon={FlaskConical} positive items={
          requestedUseful.length ? requestedUseful.map((r) => r.entry.label) : [t("fb.missedInvs.allDone")]
        } />

        {/* Unnecessary tests */}
        <FeedbackCard title={t("fb.inappropriateTests")} icon={AlertTriangle} items={
          requestedUnnecessary.length ? requestedUnnecessary.map((r) => `${r.entry.label}: ${r.entry.rationale}`) : [t("fb.unnecessary.none")]
        } />

        {/* Missed important tests */}
        {missedUseful.length > 0 && (
          <FeedbackCard title={t("fb.missedInvs")} icon={FileText} items={
            missedUseful.map((e) => t("fb.missedInvs.row", { label: e.label, why: e.rationale }))
          } />
        )}

        {/* Diagnostic reasoning */}
        <FeedbackCard title={t("fb.dxEval")} icon={Brain} items={[
          diagnosisHit ? t("fb.dxEval.ok", { d: diagnosis }) : t("fb.dxEval.expected", { d: clinicalCase.correctDiagnosis }),
          treatmentPlan.trim() ? t("fb.dxEval.txYes") : t("fb.dxEval.txNo"),
        ]} />
      </div>

      {/* Brief educational feedback */}
      <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 shadow-[var(--shadow-card)]">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-black text-primary"><Lightbulb className="h-5 w-5" /> {t("fb.briefFeedback")}</h3>
        <ul className="space-y-2">
          {[t("fb.tip1"), t("fb.tip2"), t("fb.tip3"), t("fb.tip4")].map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm font-bold text-foreground"><Star className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{tip}</span></li>
          ))}
        </ul>
      </div>

      {/* Next case recommendation */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="mb-2 flex items-center gap-2 text-lg font-black"><Award className="h-5 w-5 text-primary" /> {t("fb.nextRecommendation")}</h3>
        <p className="text-sm font-bold leading-relaxed text-muted-foreground">{t("fb.nextRecommendation.text")}</p>
      </div>

      {/* AI disclaimer */}
      <div className="rounded-2xl border border-amber-400/30 bg-amber-50/50 p-4 text-sm font-bold text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
        <div className="flex items-center gap-2"><Info className="h-4 w-4 shrink-0" /> {t("case.aiNotice")}</div>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={onBack}>{t("fb.backCases")}</Button>
        <Button onClick={onHome} className="bg-[image:var(--gradient-primary)]">{t("fb.backHome")}</Button>
      </div>
    </section>
  );
}

function ScoreChip({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-3 text-center">
      <div className="text-xs font-black text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-black tabular-nums text-foreground">{value}<span className="text-sm font-bold text-muted-foreground">/{max}</span></div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-card"><div className="h-full bg-primary" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function PatientFact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-border bg-muted/45 p-3"><div className="text-xs font-black text-primary">{label}</div><div className="mt-1 line-clamp-2 text-sm font-bold text-foreground">{value}</div></div>;
}

type VitalKey = "temp" | "hr" | "bp" | "rr" | "spo2";
type VitalStatus = "normal" | "abnormal";

function arabicToNumber(str: string): number {
  const map: Record<string, string> = { "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9" };
  return parseFloat(str.replace(/[٠-٩]/g, (d) => map[d] ?? d).replace(/[^\d.]/g, ""));
}

function vitalStatus(key: VitalKey, raw: string): VitalStatus {
  if (key === "bp") {
    const parts = raw.split("/").map(arabicToNumber);
    const [sys, dia] = parts;
    if (!sys || !dia) return "normal";
    if (sys >= 140 || sys < 90 || dia >= 90 || dia < 60) return "abnormal";
    return "normal";
  }
  const n = arabicToNumber(raw);
  if (!isFinite(n)) return "normal";
  if (key === "temp") return n >= 38 || n < 36 ? "abnormal" : "normal";
  if (key === "hr") return n > 100 || n < 60 ? "abnormal" : "normal";
  if (key === "rr") return n > 20 || n < 12 ? "abnormal" : "normal";
  if (key === "spo2") return n < 95 ? "abnormal" : "normal";
  return "normal";
}

const VITAL_ICONS: Record<VitalKey, typeof Thermometer> = {
  temp: Thermometer, hr: HeartPulse, bp: Gauge, rr: Wind, spo2: Droplets,
};

function VitalCell({ icon, label, value, status }: { icon: VitalKey; label: string; value: string; status: VitalStatus }) {
  const Icon = VITAL_ICONS[icon];
  const abnormal = status === "abnormal";
  return (
    <div className={`relative flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-[var(--shadow-soft)] transition ${abnormal ? "border-destructive/40 bg-destructive/5" : "border-border"}`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${abnormal ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground line-clamp-1">{label}</div>
        <div className={`mt-0.5 text-lg font-black tabular-nums leading-tight ${abnormal ? "text-destructive" : "text-foreground"}`}>{value}</div>
      </div>
      {abnormal && <span className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full bg-destructive ring-2 ring-card" />}
    </div>
  );
}

function ClinicalCard({ title, icon: Icon, children }: { title: string; icon: typeof Brain; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"><h2 className="mb-4 flex items-center gap-2 text-xl font-black"><Icon className="h-5 w-5 text-primary" /> {title}</h2>{children}</section>;
}

function EmptyText({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-5 text-center text-sm font-bold text-muted-foreground">{text}</div>;
}

function StatusBadge({ status, text }: { status: Finding["status"]; text: string }) {
  const Icon = status === "correct" ? CheckCircle2 : status === "close" ? Activity : XCircle;
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ${status === "correct" ? "bg-primary/10 text-primary" : status === "close" ? "bg-accent text-accent-foreground" : "bg-destructive/10 text-destructive"}`}><Icon className="h-3.5 w-3.5" /> {text}</span>;
}

function FeedbackCard({ title, items, positive = false, icon: CardIcon }: { title: string; items: string[]; positive?: boolean; icon?: typeof CheckCircle2 }) {
  const DefaultIcon = positive ? CheckCircle2 : FileText;
  const TitleIcon = CardIcon ?? DefaultIcon;
  return (
    <div className="rounded-3xl border border-border bg-muted/35 p-5">
      <h3 className="mb-3 flex items-center gap-2 text-lg font-black"><TitleIcon className="h-5 w-5 text-primary" />{title}</h3>
      <ul className="space-y-2">
        {items.filter(Boolean).map((item) => (
          <li key={item} className="flex items-start gap-2 rounded-2xl bg-card p-3 text-sm font-bold leading-relaxed text-foreground shadow-sm">
            {positive ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function buildPatientReply(question: string, complaint: string) {
  const lower = question.toLowerCase();
  if (lower.includes("أين") || lower.includes("مكان") || lower.includes("موضع")) return `الألم واضح في نفس منطقة الشكوى: ${complaint}، وأقدر أحدده أكثر لما تسألني عن الانتشار والشدة.`;
  if (lower.includes("متى") || lower.includes("بدأ")) return "بدأت الأعراض اليوم بشكل ملحوظ، وأصبحت مزعجة بما يكفي أن أطلب المساعدة.";
  if (lower.includes("شدة") || lower.includes("كم")) return "أقيّم الشدة تقريبًا ٨ من ١٠، وتزيد عندما أتحرك أو أقلق.";
  if (lower.includes("حساسية") || lower.includes("دواء")) return "عندي أدوية مذكورة في الملف، ولا أذكر حساسية جديدة غير المسجلة.";
  return "أفهم سؤالك دكتور. الأعراض ما زالت موجودة، وأحتاج أن تسألني بتفصيل عن المكان، الانتشار، العوامل المصاحبة، وما الذي يزيدها أو يخففها.";
}
