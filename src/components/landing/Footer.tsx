import { Stethoscope } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
                <Stethoscope className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">مدسم</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              منصّة عربية للتعلم السريري التفاعلي مدعومة بالذكاء الاصطناعي،
              تساعد طلاب العلوم الصحية على بناء تفكيرهم الطبي بثقة.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold">المنصة</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#how" className="transition hover:text-foreground">كيف تعمل</a></li>
              <li><a href="#features" className="transition hover:text-foreground">المميزات</a></li>
              <li><a href="#why" className="transition hover:text-foreground">لماذا نحن</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-bold">تواصل</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>الدعم الفني</li>
              <li>الشراكات الأكاديمية</li>
              <li>المدوّنة العلمية</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} مدسم. جميع الحقوق محفوظة.</div>
          <div className="flex gap-5">
            <a href="#" className="transition hover:text-foreground">سياسة الخصوصية</a>
            <a href="#" className="transition hover:text-foreground">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
