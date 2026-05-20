import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 font-serif">
        <h1 className="font-display text-5xl font-bold mb-6 font-serif text-center">{t("about.title")} <span className="text-gradient-compass">{t("header.brand")}</span></h1>
        <p className="text-muted-foreground leading-relaxed mb-8 text-center text-base">
          {t("about.intro")}
        </p>
        <div className="space-y-8">
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-academic mb-3 font-serif">{t("about.mission")}</h2>
            <p className="text-muted-foreground leading-relaxed font-serif">{t("about.missionX")}</p>
          </section>
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-academic mb-3 font-serif">{t("about.how")}</h2>
            <p className="text-muted-foreground leading-relaxed font-serif">{t("about.howX")}</p>
          </section>
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-academic mb-3 font-serif">{t("about.unis")}</h2>
            <p className="text-muted-foreground leading-relaxed font-serif">{t("about.unisX")}</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
