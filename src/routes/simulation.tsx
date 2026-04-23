import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Stethoscope, Send, Save, LogOut, User2, Activity, FlaskConical,
  ClipboardCheck, MessagesSquare, PlayCircle, Check, Loader2, NotebookPen,
  Heart, Thermometer, Clock,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/simulation")({
  component: SimulationPage,
  head: () => ({ meta: [{ title: "محاكاة سريرية — طبيبك الافتراضي" }] }),
});

type Step = { id: number; label: string; icon: typeof PlayCircle };

const STEPS: Step[] = [
  { id: 1, label: "بداية الحالة", icon: PlayCircle },
  { id: 2, label: "أخذ التاريخ المرضي", icon: MessagesSquare },
  { id: 3, label: "الفحص السريري", icon: Stethoscope },
  { id: 4, label: "التحاليل والفحوصات", icon: FlaskConical },
  { id: 5, label: "التشخيص", icon: ClipboardCheck },
  { id: 6, label: "التغذية الراجعة", icon: Activity },
];

const CASE_INFO = {
  name: "أحمد المطيري",
  age: 54,
  gender: "ذكر",
  chiefComplaint: "ألم في الصدر منذ ساعتين",
  hiddenContext: `ألم ضاغط في منتصف الصدر بدأ منذ ساعتين أثناء الراحة، ينتشر إلى الذراع الأيسر والفك،
يصاحبه تعرّق وغثيان وضيق نفس خفيف. الألم لا يخف بالراحة. مدخّن منذ ٣٠ سنة (علبة يوميًا).
يعاني من ضغط دم مرتفع منذ ٨ سنوات يأخذ له أملوديبين ٥ ملغ. سكري نوع ٢ منذ ٥ سنوات على ميتفورمين.
والده توفي بنوبة قلبية في الستين. لا يمارس رياضة. وزنه زائد. لا حساسية من الأدوية.
شدة الألم ٨ من ١٠. لم يحدث مثله من قبل.`,
};

type Msg = { role: "user" | "assistant"; content: string };

const INITIAL_GREETING: Msg = {
  role: "assistant",
  content: "السلام عليكم يا دكتور… الصراحة أحس بألم شديد في صدري من ساعتين تقريبًا، وما أدري ايش السبب.",
};

function SimulationPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [activeStep, setActiveStep] = useState(2);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  const [notes, setNotes] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/patient-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next, caseInfo: CASE_INFO }),
      });

      if (!resp.ok) {
        if (resp.status === 429) toast.error("تم تجاوز حد الاستخدام، حاول بعد قليل");
        else if (resp.status === 402) toast.error("نفدت أرصدة الذكاء الاصطناعي");
        else toast.error("تعذّر الاتصال بالمريض الافتراضي");
        setMessages(next);
        setStreaming(false);
        return;
      }
      if (!resp.body) throw new Error("no body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء المحادثة");
      setMessages(next);
    } finally {
      setStreaming(false);
    }
  };

  const completeStep = (id: number) => {
    setCompletedSteps((prev) => Array.from(new Set([...prev, id])));
    if (id < STEPS.length) setActiveStep(id + 1);
    toast.success(`تم إنهاء: ${STEPS.find((s) => s.id === id)?.label}`);
  };

  const saveProgress = () => toast.success("تم حفظ تقدّمك في هذه الحالة");
  const endInterview = () => {
    if (!confirm("هل أنت متأكد من إنهاء المقابلة؟")) return;
    toast.info("تم إنهاء المقابلة. الانتقال إلى التشخيص قريبًا");
    navigate({ to: "/dashboard" });
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const progressPct = (completedSteps.length / STEPS.length) * 100;

  return (
    <div dir="rtl" className="min-h-screen bg-[image:var(--gradient-soft)]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold leading-tight">محاكاة سريرية مباشرة</div>
              <div className="text-xs text-muted-foreground">حالة #٠٠٤٢ · بيئة آمنة للتعلّم</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium md:flex">
              <Clock className="h-3.5 w-3.5" />
              {formatTime(elapsed)}
            </div>
            <Button variant="outline" size="sm" onClick={saveProgress}>
              <Save className="h-4 w-4" />
              حفظ التقدّم
            </Button>
            <Button variant="destructive" size="sm" onClick={endInterview}>
              <LogOut className="h-4 w-4" />
              إنهاء المقابلة
            </Button>
          </div>
        </div>
      </header>

      {/* Patient card */}
      <div className="mx-auto w-full px-6 pt-6">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <User2 className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{CASE_INFO.name}</h2>
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">حالة طارئة</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span>العمر: <strong className="text-foreground">{CASE_INFO.age} سنة</strong></span>
                  <span>الجنس: <strong className="text-foreground">{CASE_INFO.gender}</strong></span>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 md:max-w-md">
              <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">الشكوى الرئيسية</div>
                <div className="mt-1 text-sm font-medium">{CASE_INFO.chiefComplaint}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Vital icon={Heart} label="نبض" value="١١٢" tone="rose" />
                <Vital icon={Activity} label="ضغط" value="١٥٠/٩٥" tone="amber" />
                <Vital icon={Thermometer} label="حرارة" value="٣٧.١" tone="emerald" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three-panel layout */}
      <main className="mx-auto grid w-full gap-5 px-6 py-5 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        {/* Left: case summary + steps */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold">مراحل الحالة</h3>
              <span className="text-xs font-semibold text-primary">{Math.round(progressPct)}٪</span>
            </div>
            <Progress value={progressPct} className="mb-4 h-1.5" />
            <ol className="space-y-1.5">
              {STEPS.map((s) => {
                const isDone = completedSteps.includes(s.id);
                const isActive = activeStep === s.id;
                const Icon = s.icon;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setActiveStep(s.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right text-sm transition ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : isDone
                          ? "text-foreground hover:bg-muted"
                          : "text-muted-foreground hover:bg-muted/60"
                      }`}
                    >
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                        isDone ? "bg-emerald-500 text-white" : isActive ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                        {isDone ? <Check className="h-3.5 w-3.5" /> : s.id}
                      </span>
                      <Icon className="h-4 w-4 opacity-70" />
                      <span className="flex-1">{s.label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            {!completedSteps.includes(activeStep) && (
              <Button onClick={() => completeStep(activeStep)} variant="outline" size="sm" className="mt-4 w-full">
                إنهاء هذه المرحلة
              </Button>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-3 text-sm font-bold">ملخص الحالة</h3>
            <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
              <p><strong className="text-foreground">السياق:</strong> مريض يحضر إلى قسم الطوارئ بشكوى ألم صدري حاد.</p>
              <p><strong className="text-foreground">الهدف:</strong> أخذ تاريخ مرضي شامل، تحديد المخاطر، وصياغة فرضية تشخيصية.</p>
              <p><strong className="text-foreground">المهارات المُقَيَّمة:</strong> التواصل، التفكير السريري، الاستقصاء المنطقي.</p>
            </div>
          </div>
        </aside>

        {/* Center: chat */}
        <section className="flex h-[calc(100vh-220px)] min-h-[520px] flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="text-sm font-semibold">مقابلة مع المريض</div>
            </div>
            <span className="text-xs text-muted-foreground">يجيب المريض بلغة طبيعية</span>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} streaming={streaming && i === messages.length - 1 && m.role === "assistant"} />
            ))}
          </div>

          <form onSubmit={send} className="border-t border-border p-4">
            <div className="flex items-end gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اطرح سؤالًا للمريض… (مثال: متى بدأ الألم؟)"
                className="h-12 flex-1 text-base"
                disabled={streaming}
              />
              <Button type="submit" size="lg" disabled={streaming || !input.trim()} className="h-12 bg-[image:var(--gradient-primary)]">
                {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                إرسال
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["متى بدأ الألم؟", "هل ينتشر الألم لمكان آخر؟", "هل تعاني من أمراض مزمنة؟", "هل تدخّن؟"].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setInput(q)}
                  className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </form>
        </section>

        {/* Right: notes panel */}
        <aside className="space-y-5">
          <div className="flex h-[calc(100vh-220px)] min-h-[520px] flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex items-center gap-2">
              <NotebookPen className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold">ملاحظاتي السريرية</h3>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">دوّن ما تجمعه من معلومات وفرضياتك التشخيصية.</p>

            <div className="mb-3 space-y-2">
              <NoteField label="HPI — تاريخ الشكوى" placeholder="بداية الألم، طبيعته، انتشاره…" />
              <NoteField label="عوامل الخطر" placeholder="تدخين، سكري، تاريخ عائلي…" />
              <NoteField label="فحص جسدي مقترح" placeholder="ECG, تسمع القلب، ضغط الذراعين…" />
            </div>

            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">ملاحظات حرّة</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="اكتب أفكارك التشخيصية وخطّتك التالية…"
                className="h-full min-h-[140px] resize-none text-sm"
              />
            </div>

            <Button onClick={saveProgress} variant="outline" className="mt-3 w-full">
              <Save className="h-4 w-4" />
              حفظ الملاحظات
            </Button>
          </div>
        </aside>
      </main>
    </div>
  );
}

function Bubble({ role, content, streaming }: { role: "user" | "assistant"; content: string; streaming?: boolean }) {
  const isPatient = role === "assistant";
  return (
    <div className={`flex gap-3 ${isPatient ? "" : "flex-row-reverse"}`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
        isPatient ? "bg-primary/10 text-primary" : "bg-foreground/10 text-foreground"
      }`}>
        {isPatient ? <User2 className="h-4.5 w-4.5" /> : <Stethoscope className="h-4.5 w-4.5" />}
      </div>
      <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
        isPatient
          ? "bg-muted text-foreground rounded-tr-2xl rounded-tl-md"
          : "bg-[image:var(--gradient-primary)] text-primary-foreground rounded-tl-2xl rounded-tr-md"
      }`}>
        <div className={`mb-0.5 text-[10px] font-semibold uppercase tracking-wide ${isPatient ? "text-primary" : "text-primary-foreground/80"}`}>
          {isPatient ? "المريض" : "أنت"}
        </div>
        <div className="whitespace-pre-wrap">
          {content || (streaming ? "…" : "")}
          {streaming && content && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-current align-middle" />}
        </div>
      </div>
    </div>
  );
}

function NoteField({ label, placeholder }: { label: string; placeholder: string }) {
  const [v, setV] = useState("");
  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">{label}</label>
      <Input value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder} className="h-8 text-xs" />
    </div>
  );
}

function Vital({ icon: Icon, label, value, tone }: { icon: typeof Heart; label: string; value: string; tone: "rose" | "amber" | "emerald" }) {
  const tones: Record<string, string> = {
    rose: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
    amber: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  };
  return (
    <div className={`flex items-center justify-between rounded-xl px-2.5 py-2 ${tones[tone]}`}>
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[11px] font-semibold">{label}</span>
      </div>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
