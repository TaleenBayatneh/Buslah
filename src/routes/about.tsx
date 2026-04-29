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
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-display text-5xl font-bold mb-6">من نحن · <span className="text-gradient-compass">بوصلة</span></h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          بوصلة مشروع تعليمي فلسطيني يهدف لمساعدة طلاب التوجيهي في فلسطين على اتخاذ أهم قرار في حياتهم الأكاديمية: اختيار التخصص الجامعي المناسب.
        </p>
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-2xl font-bold text-academic mb-3">رسالتنا</h2>
            <p className="text-muted-foreground leading-relaxed">
              نؤمن بأن كل طالب يستحق إرشاداً مبنياً على بياناته الفعلية: معدله، إمكاناته المالية، وموقعه الجغرافي — بدلاً من النصائح العامة.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-academic mb-3">كيف نعمل؟</h2>
            <p className="text-muted-foreground leading-relaxed">
              بنينا بوصلة كشات بوت ذكي مدعوم بـ workflow متطور على n8n، يجمع بيانات حقيقية من الجامعات الفلسطينية ويحلّلها فوراً ليقترح عليك الخيارات الأنسب لظروفك.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-academic mb-3">للجامعات</h2>
            <p className="text-muted-foreground leading-relaxed">
              وفّرنا لوحة تحكم تتيح للجامعات رفع بياناتها (تخصصات، رسوم، معدلات قبول) لتصل لكل طالب يبحث عن مكانه الأمثل.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}