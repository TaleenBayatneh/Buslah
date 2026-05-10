import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن — بوصلة" },
      { name: "description", content: "تعرّف على فريق بوصلة ورسالتنا في مساعدة طلاب التوجيهي في فلسطين على اختيار التخصص الجامعي المناسب." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 font-serif">
        <h1 className="font-display text-5xl font-bold mb-6 font-serif text-center">من نحن · <span className="text-gradient-compass">بوصلة</span></h1>
        <p className="text-muted-foreground leading-relaxed mb-8 text-center text-base">
          نحن فريق من طلبة هندسة الحاسوب في جامعة بيرزيت، قمنا بتطوير مشروع تخرج يتمثل في محادثة ذكية ومتقدمة موجهة لطلبة التوجيهي، بهدف تسهيل الوصول إلى تقنيات الذكاء الاصطناعي وجعلها أداة مفيدة ومتاحة للجميع.
        </p>
        <div className="space-y-8">
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-academic mb-3 font-serif">رسالتنا</h2>
            <p className="text-muted-foreground leading-relaxed font-serif">
              نؤمن بأن كل طالب يستحق إرشاداً مبنياً على بياناته الفعلية: معدله، إمكاناته المالية، وموقعه الجغرافي — بدلاً من النصائح العامة.
            </p>
          </section>
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-academic mb-3 font-serif">كيف نعمل؟</h2>
            <p className="text-muted-foreground leading-relaxed font-serif">
              بنينا بوصلة كشات بوت ذكي مدعوم بـ workflow متطور على n8n، يجمع بيانات حقيقية من مختلف الجامعات ويحلّلها فوراً ليقترح عليك الخيارات الأنسب لظروفك.
            </p>
          </section>
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-academic mb-3 font-serif">للجامعات</h2>
            <p className="text-muted-foreground leading-relaxed font-serif">
              وفّرنا لوحة تحكم تتيح للجامعات رفع بياناتها (تخصصات، رسوم، معدلات قبول) لتصل لكل طالب يبحث عن مكانه الأمثل.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}