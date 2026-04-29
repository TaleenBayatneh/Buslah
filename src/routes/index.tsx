import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Wallet, Sparkles, MessageSquare, ShieldCheck, Database } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "موجِّه — مساعدك الذكي لاختيار التخصص الجامعي" },
      { name: "description", content: "شات بوت ذكي لطلاب التوجيهي في الأردن. اختر تخصصك الجامعي بناءً على معدلك، ميزانيتك، وموقع سكنك." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block border border-oak/40 bg-paper-dim px-3 py-1 text-xs font-semibold text-oak-dark tracking-wider rounded-sm mb-6">
              لطلاب التوجيهي في الأردن • ٢٠٢٥
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold leading-[1.2] text-academic text-balance mb-6">
              خريطة طريق واضحة لمستقبلك الجامعي.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty mb-8">
              مساعدنا الذكي يحلّل معدلك، ميزانية عائلتك، وموقعك الجغرافي ليقدم لك أفضل التخصصات الجامعية التي تناسب طموحك وواقعك — بدون حيرة وبدون تخمين.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="text-base">
                <Link to="/chat">ابدأ جلستك الإرشادية <ArrowLeft className="size-4 mr-1" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link to="/about">كيف نعمل؟</Link>
              </Button>
            </div>
            <div className="mt-10 pt-6 border-t border-border flex items-center gap-4 text-sm text-muted-foreground">
              <ShieldCheck className="size-5 text-academic shrink-0" />
              <p>بياناتك سرية تماماً. يمكنك تجربة المساعد <strong className="text-foreground">كضيف</strong> بدون تسجيل.</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-oak/15 -translate-x-4 translate-y-4 rounded-sm -z-10" />
            <div className="bg-card border border-border p-6 lg:p-8 rounded-sm shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <div className="size-2.5 bg-emerald-600 rounded-full" />
                <span className="font-display text-lg font-bold text-academic">المرشد الأكاديمي الذكي</span>
              </div>
              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="size-9 bg-academic rounded-sm flex items-center justify-center shrink-0">
                    <span className="font-display text-primary-foreground text-lg font-bold leading-none -mt-1">م</span>
                  </div>
                  <div className="bg-paper-dim border border-border p-3 rounded-sm text-sm leading-relaxed">
                    أهلاً! مبروك نجاحك بالتوجيهي 🎉 خبّرني، شو فرعك ومعدلك؟
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="size-9 bg-paper-dim border border-border rounded-sm flex items-center justify-center shrink-0 text-sm font-bold">أ</div>
                  <div className="bg-academic/5 border border-academic/15 p-3 rounded-sm text-sm">
                    علمي، معدلي ٨٧.٤٪ وساكن بإربد.
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="size-9 bg-academic rounded-sm flex items-center justify-center shrink-0">
                    <span className="font-display text-primary-foreground text-lg font-bold leading-none -mt-1">م</span>
                  </div>
                  <div className="bg-paper-dim border border-border p-4 rounded-sm flex-1">
                    <p className="text-sm mb-3">ممتاز! إليك أفضل خيار قريب لك:</p>
                    <div className="bg-card border border-oak/30 p-3 rounded-sm">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-academic text-sm">هندسة البرمجيات</span>
                        <span className="text-xs font-semibold text-oak-dark">٩٢٪ قبول</span>
                      </div>
                      <p className="text-xs text-muted-foreground">جامعة العلوم والتكنولوجيا • إربد</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-paper-dim border-y border-border py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-display text-4xl font-bold text-academic mb-4">منهجية مبنية على الواقع</h2>
              <p className="text-muted-foreground leading-relaxed">
                نحن لا نقدم نصائح عامة — خوارزميتنا تعمل كمرشد متمرس يطرح الأسئلة الصحيحة ليصل بك للقرار الأدق.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Wallet, title: "الواقع المالي", text: "نحلل ميزانية الأسرة ونطابقها مع رسوم التنافس والموازي وفرص المنح المتاحة." },
                { icon: MapPin, title: "النطاق الجغرافي", text: "نحسب تكلفة المواصلات والسكن، ونرشّح لك الجامعات الأنسب لمنطقتك." },
                { icon: Sparkles, title: "الميول والقدرات", text: "نربط معدلك وفرعك في التوجيهي بالتخصصات المطلوبة فعلياً في سوق العمل." },
              ].map((f, i) => (
                <div key={i} className="bg-card p-7 border border-border rounded-sm shadow-sm">
                  <div className="size-12 bg-academic/10 rounded-sm flex items-center justify-center mb-4">
                    <f.icon className="size-6 text-academic" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Universities */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-academic text-primary-foreground rounded-sm p-10 lg:p-14 grid lg:grid-cols-2 gap-10 items-center border-r-4 border-oak">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-oak mb-4">
                <Database className="size-4" /> للجامعات
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                هل تمثّل جامعة؟ ارفع بياناتك بسهولة.
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-6">
                وفّرنا لك لوحة تحكم خاصة لرفع ملفات التخصصات، رسوم الساعة، ومعدلات القبول. بياناتك تصل مباشرة لقاعدة بيانات الشات بوت ليستفيد منها الطلاب.
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link to="/auth">سجّل حسابك كجامعة</Link>
              </Button>
            </div>
            <ul className="space-y-3 text-sm">
              {["رفع ملفات Excel/CSV بسهولة", "معالجة تلقائية عبر workflow متكامل", "متابعة حالة كل ملف", "بياناتك آمنة ومشفرة"].map((item) => (
                <li key={item} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-sm">
                  <div className="size-1.5 bg-oak rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="font-display text-4xl font-bold text-academic mb-4">جاهز لرسم ملامح مستقبلك؟</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            لا تترك أهم قرار في حياتك للصدفة. ابدأ جلستك الآن واحصل على خريطة دقيقة لتخصصك الجامعي.
          </p>
          <Button asChild size="lg" className="text-base">
            <Link to="/chat"><MessageSquare className="size-4 ml-1" /> ابدأ المحادثة مجاناً</Link>
          </Button>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
