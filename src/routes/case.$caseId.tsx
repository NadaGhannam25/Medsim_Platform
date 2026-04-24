import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Activity, ArrowLeft, Bot, Brain, CheckCircle2, ChevronLeft, ClipboardCheck, FileText,
  FlaskConical, HeartPulse, HelpCircle, Home, Loader2, MessageSquareText, NotebookPen,
  Pill, Save, Send, ShieldAlert, Sparkles, Stethoscope, Target, User2, XCircle,
} from "lucide-react";
import { BodyMap } from "@/components/examination/BodyMap";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth-context";
import { getLearningCase, type InvestigationOption, type TreatmentOption } from "@/data/case-flow";
import { REGION_LABELS, SEVERITY_OPTIONS, SYMPTOM_OPTIONS, type BodyRegionId, type Severity, type SymptomType } from "@/data/clinical-cases";

export const Route = createFileRoute("/case/$caseId")({
  component: CaseJourneyPage,
  head: () => ({ meta: [{ title: "رحلة الحالة السريرية — طبيبك الافتراضي" }] }),
});

type StageId = "interview" | "exam" | "investigations" | "diagnosis" | "treatment" | "feedback";
type Message = { role: "user" | "assistant"; content: string };
type Finding = { region: BodyRegionId; severity: Severity; symptom: SymptomType; notes: string; feedback: string; status: "correct" | "close" | "wrong" };

const STAGES: Array<{ id: StageId; title: string; icon: typeof MessageSquareText }> = [
  { id: "interview", title: "Patient Interview", icon: MessageSquareText },
  { id: "exam", title: "Clinical Examination", icon: Stethoscope },
  { id: "investigations", title: "Investigations", icon: FlaskConical },
  { id: "diagnosis", title: "Diagnosis Support", icon: Brain },
  { id: "treatment", title: "Treatment / Medication Suggestions", icon: Pill },
  { id: "feedback", title: "Final Feedback", icon: ClipboardCheck },
];

function CaseJourneyPage() {
  const { caseId } = Route.useParams();
  const clinicalCase = getLearningCase(caseId);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [stage, setStage] = useState<StageId>("interview");
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [interviewNotes, setInterviewNotes] = useState<string[]>([]);
  const [bodyView, setBodyView] = useState<"front" | "back">("front");
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [differentials, setDifferentials] = useState("");
  const [justification, setJustification] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [managementNote, setManagementNote] = useState("");
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

  const activeIndex = STAGES.findIndex((item) => item.id === stage);
  const completedPercent = ((activeIndex + 1) / STAGES.length) * 100;
  const correctFindingCount = findings.filter((item) => item.status === "correct").length;
  const usefulTests = clinicalCase?.investigations.filter((item) => item.useful).map((item) => item.id) ?? [];
  const selectedUsefulTests = selectedTests.filter((id) => usefulTests.includes(id)).length;
  const diagnosisIsCorrect = clinicalCase ? normalize(diagnosis).includes(normalize(clinicalCase.correctDiagnosis).slice(0, 8)) || normalize(clinicalCase.correctDiagnosis).includes(normalize(diagnosis).slice(0, 8)) : false;
  const correctTreatmentCount = clinicalCase?.treatments.filter((item) => item.correct && selectedTreatments.includes(item.id)).length ?? 0;
  const finalScore = Math.min(100, Math.round((interviewNotes.length >= 3 ? 18 : interviewNotes.length * 6) + correctFindingCount * 18 + selectedUsefulTests * 8 + (diagnosisIsCorrect ? 24 : 8) + correctTreatmentCount * 14));

  const selectedRegions = useMemo(() => findings.map((item) => item.region), [findings]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  }

  if (!clinicalCase) {
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

  const moveTo = (next: StageId) => setStage(next);
  const saveProgress = () => toast.success("تم حفظ تقدمك التعليمي داخل هذه الحالة");

  const sendQuestion = async (event: FormEvent) => {
    event.preventDefault();
    const text = question.trim();
    if (!text || streaming) return;
    const userMessage: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setQuestion("");
    setInterviewNotes((prev) => Array.from(new Set([...prev, text])));
    setStreaming(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/patient-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
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
          } catch {
            continue;
          }
        }
      }
    } catch {
      const fallback = buildPatientReply(text, clinicalCase.chiefComplaint);
      setMessages([...nextMessages, { role: "assistant", content: fallback }]);
      toast.info("تم استخدام رد تدريبي محلي للمريض الافتراضي");
    } finally {
      setStreaming(false);
    }
  };

  const toggleRegion = (region: BodyRegionId) => {
    const exists = findings.some((item) => item.region === region);
    if (exists) {
      setFindings((prev) => prev.filter((item) => item.region !== region));
      return;
    }
    const status = clinicalCase.expectedRegions.includes(region) ? "correct" : clinicalCase.closeRegions.includes(region) ? "close" : "wrong";
    const feedback = status === "correct"
      ? "تم اختيار الموقع الصحيح"
      : status === "close"
        ? "قريب جدًا، حاول تحديد الموقع بدقة أكبر"
        : "ليس هذا الموقع، راجع أعراض المريض وحاول مرة أخرى";
    setFindings((prev) => [...prev, { region, severity: "moderate", symptom: "pain", notes: "", feedback, status }]);
    if (status === "correct") toast.success(feedback);
    else if (status === "close") toast.info(feedback);
    else toast.error(feedback);
  };

  const updateFinding = (region: BodyRegionId, patch: Partial<Finding>) => {
    setFindings((prev) => prev.map((item) => item.region === region ? { ...item, ...patch } : item));
  };

  const toggleTest = (test: InvestigationOption) => {
    setSelectedTests((prev) => prev.includes(test.id) ? prev.filter((id) => id !== test.id) : [...prev, test.id]);
    toast(test.useful ? "فحص مفيد سريريًا" : "فحص أقل ملاءمة", { description: test.explanation });
  };

  const toggleTreatment = (treatment: TreatmentOption) => {
    setSelectedTreatments((prev) => prev.includes(treatment.id) ? prev.filter((id) => id !== treatment.id) : [...prev, treatment.id]);
    toast(treatment.correct ? "اختيار علاجي مناسب" : "اختيار يحتاج مراجعة", { description: treatment.explanation });
  };

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
        <Button variant="outline" onClick={saveProgress} className="h-11 gap-2 font-black"><Save className="h-4 w-4" /> حفظ التقدم</Button>
      </div>

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
          <div className="grid flex-1 gap-3 md:grid-cols-3">
            <PatientFact label="الشكوى الرئيسية" value={clinicalCase.chiefComplaint} />
            <PatientFact label="الأمراض المزمنة" value={clinicalCase.chronicDiseases.join("، ") || "لا توجد"} />
            <PatientFact label="الحساسية" value={clinicalCase.allergies.join("، ") || "لا توجد"} />
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between text-xs font-black text-muted-foreground"><span>مسار الحالة</span><span>{Math.round(completedPercent)}٪</span></div>
          <Progress value={completedPercent} className="mb-4 h-2" />
          <div className="grid gap-2 md:grid-cols-6">
            {STAGES.map((item, index) => {
              const Icon = item.icon;
              const active = item.id === stage;
              const done = index < activeIndex;
              return (
                <button key={item.id} onClick={() => moveTo(item.id)} className={`rounded-2xl border px-3 py-3 text-right transition ${active ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : done ? "border-border bg-accent text-accent-foreground" : "border-border bg-muted/60 text-muted-foreground hover:bg-muted"}`}>
                  <Icon className="mb-2 h-5 w-5" />
                  <div className="text-sm font-black leading-tight">{index + 1}. {item.title}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {stage === "interview" && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="border-b border-border p-5">
              <h2 className="flex items-center gap-2 text-2xl font-black"><MessageSquareText className="h-6 w-6 text-primary" /> مقابلة المريض</h2>
              <p className="mt-1 text-base text-muted-foreground">اسأل أسئلة مركزة واجمع التاريخ المرضي قبل الانتقال للفحص.</p>
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
                <Input value={question} onChange={(event) => setQuestion(event.target.value)} className="h-12 text-base" placeholder="اكتب سؤالك للمريض… مثل: أين ينتشر الألم؟" />
                <Button disabled={streaming} className="h-12 gap-2 px-6 font-black"><Send className="h-4 w-4" /> إرسال</Button>
              </div>
            </form>
          </section>
          <aside className="space-y-5">
            <ClinicalCard title="انطباعك الأولي" icon={Brain}>
              <Textarea value={hypothesis} onChange={(event) => setHypothesis(event.target.value)} className="min-h-28 text-base" placeholder="اكتب ما تعتقد أنه التشخيص المحتمل أو المشكلة الأساسية…" />
            </ClinicalCard>
            <ClinicalCard title="معلومات مهمة جمعتها" icon={NotebookPen}>
              <div className="space-y-2">
                {interviewNotes.length ? interviewNotes.slice(-5).map((note) => <div key={note} className="rounded-2xl bg-muted p-3 text-sm font-bold">{note}</div>) : <EmptyText text="ستظهر هنا الأسئلة والمعلومات المهمة التي جمعتها." />}
              </div>
            </ClinicalCard>
            <Button onClick={() => moveTo("exam")} className="h-12 w-full gap-2 bg-[image:var(--gradient-primary)] text-base font-black shadow-[var(--shadow-soft)]">إنهاء المقابلة والانتقال للفحص <ChevronLeft className="h-5 w-5" /></Button>
          </aside>
        </div>
      )}

      {stage === "exam" && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="text-2xl font-black">حدد الموقع بدقة</h2><p className="text-base text-muted-foreground">اختر منطقة صغيرة كما تفعل في نظام فحص سريري حقيقي.</p></div>
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
            <Button onClick={() => moveTo("investigations")} disabled={!findings.length} className="h-12 w-full gap-2 font-black">الانتقال للفحوصات والتحاليل <ChevronLeft className="h-5 w-5" /></Button>
          </aside>
        </div>
      )}

      {stage === "investigations" && (
        <StageShell title="اختيار الفحوصات" subtitle="اختر الفحوصات التي تدعم التفكير التشخيصي وتجنب الفحوصات غير الضرورية." icon={FlaskConical} nextLabel="الانتقال لدعم التشخيص" onNext={() => moveTo("diagnosis")}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {clinicalCase.investigations.map((test) => {
              const active = selectedTests.includes(test.id);
              return <button key={test.id} onClick={() => toggleTest(test)} className={`rounded-3xl border p-5 text-right transition hover:-translate-y-0.5 ${active ? "border-primary bg-primary/10 shadow-[var(--shadow-card)]" : "border-border bg-card hover:bg-muted"}`}>
                <div className="mb-2 flex items-center justify-between"><span className="text-xl font-black">{test.label}</span>{active && <CheckCircle2 className="h-5 w-5 text-primary" />}</div>
                <p className="text-sm font-medium leading-relaxed text-muted-foreground">{test.explanation}</p>
              </button>;
            })}
          </div>
        </StageShell>
      )}

      {stage === "diagnosis" && (
        <StageShell title="التشخيص ودعم التفكير السريري" subtitle="اكتب تشخيصك، ثم استخدم المساعدة إذا احتجت لتوسيع التفكير دون كشف الإجابة مباشرة." icon={Brain} nextLabel="الانتقال للعلاج" onNext={() => moveTo("treatment")}>
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="space-y-4">
              <Input value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)} className="h-12 text-base" placeholder="التشخيص الأكثر احتمالًا" />
              <Textarea value={differentials} onChange={(event) => setDifferentials(event.target.value)} className="min-h-24 text-base" placeholder="التشخيصات التفريقية" />
              <Textarea value={justification} onChange={(event) => setJustification(event.target.value)} className="min-h-28 text-base" placeholder="مبرر التشخيص بناءً على القصة والفحص والفحوصات" />
              <Textarea value={nextStep} onChange={(event) => setNextStep(event.target.value)} className="min-h-24 text-base" placeholder="الخطوة التالية أو الخطة الأولية" />
              {diagnosis && <DiagnosisFeedback correct={diagnosisIsCorrect} diagnosis={diagnosis} correctDiagnosis={clinicalCase.correctDiagnosis} />}
            </div>
            <ClinicalCard title="مساعدة تشخيصية" icon={HelpCircle}>
              <Button variant="outline" onClick={() => setShowHints((value) => !value)} className="mb-4 h-11 w-full gap-2 font-black"><Sparkles className="h-4 w-4" /> ساعدني في التشخيص</Button>
              {showHints ? <div className="space-y-3">{clinicalCase.diagnosisHints.map((hint) => <div key={hint.diagnosis} className="rounded-2xl border border-border bg-muted/45 p-4"><h3 className="font-black">{hint.diagnosis}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{hint.fit}</p><div className="mt-2 text-xs font-black text-primary">يدعمه: {hint.supporting.join("، ")}</div><div className="mt-1 text-xs font-bold text-muted-foreground">ينقصه: {hint.missing}</div></div>)}</div> : <EmptyText text="اضغط زر المساعدة لرؤية احتمالات منظمة تساعدك على التفكير." />}
            </ClinicalCard>
          </div>
        </StageShell>
      )}

      {stage === "treatment" && (
        <StageShell title="اقتراح العلاج أو الدواء" subtitle="اختر خطة تعليمية مناسبة. هذه المحاكاة لا تمثل نصيحة طبية للمرضى الحقيقيين." icon={Pill} nextLabel="عرض التغذية الراجعة النهائية" onNext={() => moveTo("feedback")}>
          <div className="mb-5 rounded-2xl border border-border bg-accent p-4 text-sm font-bold text-accent-foreground">تنبيه تعليمي: الخيارات هنا لغرض التدريب السريري فقط وليست تعليمات علاجية لحالة حقيقية.</div>
          <div className="grid gap-4 lg:grid-cols-3">
            {clinicalCase.treatments.map((treatment) => {
              const active = selectedTreatments.includes(treatment.id);
              return <button key={treatment.id} onClick={() => toggleTreatment(treatment)} className={`rounded-3xl border p-5 text-right transition ${active ? "border-primary bg-primary/10 shadow-[var(--shadow-card)]" : "border-border bg-card hover:bg-muted"}`}><div className="text-lg font-black">{treatment.label}</div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{treatment.explanation}</p></button>;
            })}
          </div>
          <Textarea value={managementNote} onChange={(event) => setManagementNote(event.target.value)} className="mt-5 min-h-28 text-base" placeholder="اكتب ملاحظتك حول الخطة والمتابعة ومتى يجب التصعيد…" />
        </StageShell>
      )}

      {stage === "feedback" && (
        <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-3xl font-black">تقرير التغذية الراجعة النهائي</h2><p className="mt-1 text-base text-muted-foreground">تحليل أدائك عبر المقابلة والفحص والفحوصات والتشخيص والعلاج.</p></div><div className="rounded-3xl bg-[image:var(--gradient-primary)] px-7 py-5 text-center text-primary-foreground shadow-[var(--shadow-soft)]"><div className="text-sm font-bold">النتيجة النهائية</div><div className="text-4xl font-black">{finalScore}٪</div></div></div>
          <div className="grid gap-4 lg:grid-cols-2">
            <FeedbackCard title="ما أديته جيدًا" items={[correctFindingCount ? `حددت ${correctFindingCount} موضعًا سريريًا مهمًا` : "بدأت بتوثيق الفحص", selectedUsefulTests ? `اخترت ${selectedUsefulTests} فحصًا مفيدًا` : "تعرفت على مرحلة الفحوصات", diagnosisIsCorrect ? "وصلت لتشخيص متوافق مع الحالة" : "كتبت محاولة تشخيصية قابلة للتحسين"]} positive />
            <FeedbackCard title="أسئلة كان يجب التركيز عليها" items={clinicalCase.mustAsk} />
            <FeedbackCard title="نقاط فحص مفقودة" items={clinicalCase.missedExamPoints} />
            <FeedbackCard title="افتراضات أو اختيارات تحتاج مراجعة" items={[...clinicalCase.investigations.filter((test) => selectedTests.includes(test.id) && !test.useful).map((test) => `${test.label}: ${test.explanation}`), ...clinicalCase.treatments.filter((treatment) => selectedTreatments.includes(treatment.id) && !treatment.correct).map((treatment) => `${treatment.label}: ${treatment.explanation}`), diagnosisIsCorrect ? "لا توجد مشكلة رئيسية في التشخيص." : `راجع التشخيص: التشخيص المتوقع تعليميًا هو ${clinicalCase.correctDiagnosis}.`]} />
            <FeedbackCard title="توصيات للتحسين" items={["ابدأ دائمًا بأسئلة مفتوحة ثم انتقل لأسئلة موجهة.", "اربط موضع الألم بالتشخيصات المحتملة قبل طلب الفحوصات.", "اختر الفحوصات التي تغير القرار السريري فقط.", "اكتب مبررًا واضحًا يربط القصة بالفحص والفحوصات."]} positive />
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-3"><Button variant="outline" onClick={() => navigate({ to: "/clinical-cases" })}>العودة للحالات</Button><Button onClick={() => navigate({ to: "/dashboard" })} className="bg-[image:var(--gradient-primary)]">العودة للرئيسية</Button></div>
        </section>
      )}
    </DashboardLayout>
  );
}

function StageShell({ title, subtitle, icon: Icon, children, nextLabel, onNext }: { title: string; subtitle: string; icon: typeof FlaskConical; children: React.ReactNode; nextLabel: string; onNext: () => void }) {
  return <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h2 className="flex items-center gap-2 text-2xl font-black"><Icon className="h-6 w-6 text-primary" /> {title}</h2><p className="mt-1 text-base leading-relaxed text-muted-foreground">{subtitle}</p></div><Button onClick={onNext} className="h-12 gap-2 font-black">{nextLabel}<ChevronLeft className="h-5 w-5" /></Button></div>{children}</section>;
}

function PatientFact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-border bg-muted/45 p-3"><div className="text-xs font-black text-primary">{label}</div><div className="mt-1 line-clamp-2 text-sm font-bold text-foreground">{value}</div></div>;
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

function DiagnosisFeedback({ correct, diagnosis, correctDiagnosis }: { correct: boolean; diagnosis: string; correctDiagnosis: string }) {
  return <div className={`rounded-2xl border p-4 ${correct ? "border-primary bg-primary/10" : "border-destructive/30 bg-destructive/10"}`}><div className="font-black">{correct ? "تشخيص صحيح" : "التشخيص يحتاج مراجعة"}</div><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{correct ? `اختيارك (${diagnosis}) متوافق مع نمط الحالة. اربط ذلك بالأعراض والفحوصات قبل العلاج.` : `اختيارك (${diagnosis}) لا يطابق كل المعطيات. راجع موضع الألم، القصة، والفحوصات. التشخيص التعليمي المرجح: ${correctDiagnosis}.`}</p></div>;
}

function FeedbackCard({ title, items, positive = false }: { title: string; items: string[]; positive?: boolean }) {
  return <div className="rounded-3xl border border-border bg-muted/35 p-5"><h3 className="mb-3 flex items-center gap-2 text-xl font-black">{positive ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <FileText className="h-5 w-5 text-primary" />}{title}</h3><ul className="space-y-2">{items.filter(Boolean).map((item) => <li key={item} className="rounded-2xl bg-card p-3 text-sm font-bold leading-relaxed text-foreground shadow-sm">{item}</li>)}</ul></div>;
}

function buildPatientReply(question: string, complaint: string) {
  const lower = question.toLowerCase();
  if (lower.includes("أين") || lower.includes("مكان") || lower.includes("موضع")) return `الألم واضح في نفس منطقة الشكوى: ${complaint}، وأقدر أحدده أكثر لما تسألني عن الانتشار والشدة.`;
  if (lower.includes("متى") || lower.includes("بدأ")) return "بدأت الأعراض اليوم بشكل ملحوظ، وأصبحت مزعجة بما يكفي أن أطلب المساعدة.";
  if (lower.includes("شدة") || lower.includes("كم")) return "أقيّم الشدة تقريبًا ٨ من ١٠، وتزيد عندما أتحرك أو أقلق.";
  if (lower.includes("حساسية") || lower.includes("دواء")) return "عندي أدوية مذكورة في الملف، ولا أذكر حساسية جديدة غير المسجلة.";
  return "أفهم سؤالك دكتور. الأعراض ما زالت موجودة، وأحتاج أن تسألني بتفصيل عن المكان، الانتشار، العوامل المصاحبة، وما الذي يزيدها أو يخففها.";
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[\u064B-\u065F]/g, "").replace(/أ|إ|آ/g, "ا").replace(/ة/g, "ه");
}
