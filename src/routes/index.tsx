import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { CompassLogo } from "@/components/CompassLogo";
import { ArrowLeft, MapPin, Wallet, Sparkles, MessageSquare, ShieldCheck, Database, Compass, Navigation, GraduationCap, TrendingUp, Heart, ChevronDown } from "lucide-react";
import { useI18n, type TKey } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "بوصلة — مرشدك الذكي لاختيار التخصص الجامعي في فلسطين" },
      { name: "description", content: "بوصلة: شات بوت ذكي لطلاب التوجيهي في فلسطين. اختر تخصصك الجامعي بناءً على معدلك، ميزانيتك، وموقع سكنك." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  const suggestions: { mKey: TKey; uKey: TKey; match: string }[] = [
    { mKey: "sug.cs", uKey: "sug.cs.uni", match: "٩٢٪" },
    { mKey: "sug.med", uKey: "sug.med.uni", match: "٨٨٪" },
    { mKey: "sug.biz", uKey: "sug.biz.uni", match: "٩٠٪" },
    { mKey: "sug.pharm", uKey: "sug.pharm.uni", match: "٨٥٪" },
    { mKey: "sug.design", uKey: "sug.design.uni", match: "٨٧٪" },
    { mKey: "sug.civil", uKey: "sug.civil.uni", match: "٨٩٪" },
  ];
  const [sIdx, setSIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSIdx((i) => (i + 1) % suggestions.length), 2800);
    return () => clearInterval(id);
  }, []);
  const current = suggestions[sIdx];
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="absolute inset-0 compass-grid opacity-[0.4] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 py-10 lg:py-28 grid lg:grid-cols-[1.1fr_1fr] gap-14 items-center relative">
            <div className="text-center lg:text-right font-serif">
              <span className="inline-flex items-center gap-2 border border-oak/40 bg-card/60 backdrop-blur px-4 py-1.5 text-xs font-semibold text-oak-dark tracking-wider rounded-full mb-6 font-serif">
                <span className="size-1.5 bg-oak rounded-full animate-pulse" />
                {t("hero.tag")}
              </span>
              <h1 className="font-display text-5xl lg:text-7xl font-bold leading-[1.15] text-balance mb-6 font-serif">
                <span className="text-foreground">{t("hero.title1")}</span>{" "}
                <span className="text-gradient-compass">{t("hero.title2")}</span>
                <br />
                {t("hero.title3")}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty mb-8 max-w-xl mx-auto lg:mx-0 font-serif">
                <strong className="text-foreground">{t("hero.descBold")}</strong> — {t("hero.desc").replace(/^بوصلة\s*—\s*/, "").replace(/^Boslah\s*—\s*/, "")}
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start font-serif">
                <Button asChild size="lg" variant="outline" className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 rounded-md px-3 text-sm font-bold">
                  <Link to="/chat"><Compass className="size-4 ml-2" /> {t("hero.cta")} <ArrowLeft className="size-4 mr-1" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base">
                  <Link to="/about">{t("hero.howWorks")}</Link>
                </Button>
              </div>
              <div className="lg:hidden mt-5 flex flex-col items-center gap-1 text-oak-dark">
                <span className="text-xs font-bold tracking-wider">{t("hero.scrollHint")}</span>
                <ChevronDown className="size-5 animate-bounce" />
              </div>
              <div className="mt-8 pt-6 border-t border-border flex items-center gap-4 text-sm text-muted-foreground justify-center lg:justify-start">
                <ShieldCheck className="size-5 text-academic shrink-0" />
                <p>{t("hero.privacy")}</p>
              </div>
            </div>

            {/* Giant Animated Compass */}
            <div className="relative flex items-center justify-center min-h-[420px]">
              <div className="absolute size-[380px] rounded-full bg-academic/10 animate-pulse-ring" />
              <div className="absolute size-[300px] rounded-full bg-oak/10 animate-pulse-ring" style={{ animationDelay: "1.2s" }} />
              <div className="absolute size-[340px] rounded-full border-2 border-dashed border-academic/25 animate-spin-slow" />
              <div className="absolute size-[280px] rounded-full border border-oak/30" />
              <div className="relative size-64 lg:size-72 rounded-full bg-gradient-compass shadow-compass flex items-center justify-center">
                <CompassLogo className="size-44 lg:size-52 text-primary-foreground" />
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-card border border-border px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-float">{t("hero.compass.north")}</div>
                <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-card border border-border px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-float" style={{ animationDelay: "0.5s" }}>{t("hero.compass.east")}</div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card border border-border px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-float" style={{ animationDelay: "1s" }}>{t("hero.compass.south")}</div>
                <div className="absolute top-1/2 -left-6 -translate-y-1/2 bg-card border border-border px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-float" style={{ animationDelay: "1.5s" }}>{t("hero.compass.west")}</div>
              </div>
              <div key={sIdx} className="absolute bottom-2 right-0 lg:right-4 bg-card border border-oak/30 rounded-xl p-3 shadow-glow w-52 animate-float transition-opacity duration-500" style={{ animationDelay: "0.8s" }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="size-7 rounded-full bg-gradient-warm flex items-center justify-center shrink-0">
                    <GraduationCap className="size-4 text-primary-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground">{t("hero.suggestion")}</span>
                </div>
                <p className="font-bold text-sm text-academic">{t(current.mKey)}</p>
                <p className="text-xs text-muted-foreground">{t(current.uKey)} · {current.match} {t("hero.match")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Four Directions */}
        <section className="bg-paper-dim border-y border-border py-20 border-inherit">
          <div className="max-w-7xl mx-auto px-6 border-gray-950">
            <div className="text-center max-w-2xl mx-auto mb-14 font-serif">
              <span className="inline-block font-bold tracking-[0.3em] text-oak-dark mb-3 text-sm font-serif">{t("dirs.tag")}</span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold mb-4 font-serif">
                <span className="text-gradient-compass">{t("dirs.title1")}</span> {t("dirs.title2")}
              </h2>
              <p className="text-muted-foreground leading-relaxed font-serif">{t("dirs.subtitle")}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {([
                { dirKey: "dirs.n.dir", icon: TrendingUp, tKey: "dirs.n.t", xKey: "dirs.n.x" },
                { dirKey: "dirs.e.dir", icon: Wallet, tKey: "dirs.e.t", xKey: "dirs.e.x" },
                { dirKey: "dirs.s.dir", icon: MapPin, tKey: "dirs.s.t", xKey: "dirs.s.x" },
                { dirKey: "dirs.w.dir", icon: Heart, tKey: "dirs.w.t", xKey: "dirs.w.x" },
              ] as { dirKey: TKey; icon: typeof TrendingUp; tKey: TKey; xKey: TKey }[]).map((f, i) => (
                <div key={i} className="group relative bg-card p-6 border border-border rounded-2xl shadow-sm hover:shadow-compass hover:-translate-y-1 transition-all">
                  <div className="absolute top-4 left-4 text-[10px] font-bold tracking-widest text-muted-foreground/60">{t(f.dirKey).toUpperCase()}</div>
                  <div className="size-12 bg-gradient-compass rounded-xl flex items-center justify-center mb-4 shadow-compass">
                    <f.icon className="size-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 font-display font-serif">{t(f.tKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-serif">{t(f.xKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14 font-serif">
            <h2 className="font-display font-bold mb-4 font-serif text-3xl">{t("journey.title1")} <span className="text-gradient-compass">{t("hero.descBold")}</span> {t("journey.title2")}</h2>
            <p className="text-muted-foreground font-serif">{t("journey.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-12 right-[16.66%] left-[16.66%] h-0.5 bg-gradient-to-l from-academic via-oak to-academic opacity-30" />
            {([
              { step: "١", tKey: "journey.s1.t", xKey: "journey.s1.x" },
              { step: "٢", tKey: "journey.s2.t", xKey: "journey.s2.x" },
              { step: "٣", tKey: "journey.s3.t", xKey: "journey.s3.x" },
            ] as { step: string; tKey: TKey; xKey: TKey }[]).map((s, i) => (
              <div key={i} className="relative bg-card border border-border rounded-2xl p-7 text-center shadow-sm font-serif">
                <div className="size-24 mx-auto mb-4 rounded-full bg-gradient-compass shadow-compass flex items-center justify-center font-display text-4xl font-bold text-primary-foreground relative z-10">
                  {s.step}
                </div>
                <h3 className="font-display text-xl font-bold mb-2 text-academic font-serif">{t(s.tKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-serif">{t(s.xKey)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Live chat preview */}
        <section className="bg-paper-dim border-y border-border py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-oak-dark mb-3">
                  <Navigation className="size-3" /> {t("preview.tag")}
                </span>
                <h2 className="font-display text-4xl font-bold mb-4 font-serif">{t("preview.title")}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6 font-serif">{t("preview.desc")}</p>
                <Button asChild size="lg" className="shadow-compass">
                  <Link to="/chat"><MessageSquare className="size-4 ml-2" /> {t("preview.try")}</Link>
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-warm opacity-20 blur-3xl -z-10" />
                <div className="bg-card border border-border p-6 lg:p-7 rounded-2xl shadow-compass">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                    <div className="size-9 rounded-full bg-gradient-compass flex items-center justify-center">
                      <CompassLogo className="size-6" />
                    </div>
                    <div>
                      <div className="font-display text-base font-bold text-foreground">{t("hero.descBold")}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5"><span className="size-1.5 bg-emerald-500 rounded-full" /> {t("preview.online")}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-2.5">
                      <div className="bg-paper-dim border border-border p-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed max-w-[85%]">
                        {t("preview.bot1")}
                      </div>
                    </div>
                    <div className="flex gap-2.5 flex-row-reverse">
                      <div className="bg-academic/10 border border-academic/20 p-3 rounded-2xl rounded-tl-sm text-sm max-w-[85%]">
                        {t("preview.user1")}
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <div className="bg-paper-dim border border-border p-4 rounded-2xl rounded-tr-sm flex-1">
                        <p className="text-sm mb-3">{t("preview.bot2")}</p>
                        <div className="bg-card border border-oak/30 p-3 rounded-xl">
                          <div className="flex justify-between mb-1">
                            <span className="font-bold text-academic text-sm">{t("preview.bot2.major")}</span>
                            <span className="text-xs font-semibold text-oak-dark bg-oak/10 px-2 py-0.5 rounded-full">٩٢٪</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{t("preview.bot2.uni")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* For Universities */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="relative bg-gradient-compass text-primary-foreground rounded-3xl p-10 lg:p-14 grid lg:grid-cols-2 gap-10 items-center overflow-hidden shadow-compass">
            <div className="absolute -top-20 -left-20 size-72 rounded-full bg-oak/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 size-72 rounded-full bg-oak/20 blur-3xl pointer-events-none" />
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-oak mb-4 text-inherit">
                <Database className="size-4" /> {t("uniCta.tag")}
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4 leading-tight font-serif">
                {t("uniCta.title")}
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-6 font-serif text-xl">
                {t("uniCta.desc")}
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link to="/universities">{t("uniCta.btn")}</Link>
              </Button>
            </div>
            <ul className="space-y-3 text-sm">
              {([
                { key: "uniCta.b1" as TKey, link: false },
                { key: "uniCta.b2" as TKey, link: false },
                { key: "uniCta.b3" as TKey, link: false },
                { key: "uniCta.b4" as TKey, link: true },
              ]).map(({ key, link }) => (
                <li key={key} className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/15 px-4 py-3 rounded-xl">
                  <div className="size-2 bg-oak rounded-full shadow-glow" />
                  {link ? (
                    <Link to="/universities" className="hover:underline">{t(key)}</Link>
                  ) : (
                    t(key)
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 py-24 text-center relative font-serif">
          <div className="absolute inset-0 bg-gradient-hero -z-10" />
          <div className="size-20 mx-auto mb-6 rounded-full bg-gradient-compass shadow-compass flex items-center justify-center shadow-md">
            <Compass className="size-10 text-primary-foreground" />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold mb-4 font-serif">
            {t("finalCta.title1")} <span className="text-gradient-compass">{t("finalCta.title2")}</span>
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed text-lg font-serif">
            {t("finalCta.desc")}
          </p>
          <Button asChild size="lg" className="text-base shadow-compass">
            <Link to="/chat"><Sparkles className="size-4 ml-2" /> {t("finalCta.btn")}</Link>
          </Button>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
