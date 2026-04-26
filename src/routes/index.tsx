import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { WhyMatters } from "@/components/landing/WhyMatters";
import { Footer } from "@/components/landing/Footer";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "مدسم — تعلّم الطب بحالات سريرية ذكية" },
      {
        name: "description",
        content:
          "منصّة عربية تفاعلية لطلاب العلوم الصحية: تدرّب على حالات سريرية افتراضية مدعومة بالذكاء الاصطناعي واحصل على تقييم تفصيلي.",
      },
      { property: "og:title", content: "مدسم — تعلّم سريري ذكي بالعربية" },
      { property: "og:description", content: "حالات سريرية تفاعلية مدعومة بالذكاء الاصطناعي لطلاب العلوم الصحية." },
    ],
  }),
});

function Index() {
  const { dir } = useI18n();
  return (
    <div dir={dir} className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <WhyMatters />
      </main>
      <Footer />
    </div>
  );
}
