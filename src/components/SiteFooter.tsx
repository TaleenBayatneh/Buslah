import { Link } from "@tanstack/react-router";
import { CompassLogo } from "@/components/CompassLogo";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border bg-paper-dim mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 font-serif">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="size-9 bg-gradient-compass rounded-full flex items-center justify-center shadow-compass">
              <CompassLogo className="size-6" animated={false} />
            </div>
            <span className="font-display text-xl font-bold text-gradient-compass font-serif">{t("header.brand")}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed font-serif text-right">
            {t("footer.tagline")}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-3">{t("footer.links")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-academic">{t("nav.about")}</Link></li>
            <li><Link to="/universities" className="hover:text-academic">{t("nav.universities")}</Link></li>
            <li><Link to="/chat" className="hover:text-academic">{t("nav.chat")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-3">{t("footer.forUnis")}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("footer.forUnisDesc")}
          </p>
          <Link to="/universities" className="inline-block mt-2 text-sm text-academic font-semibold hover:underline">
            {t("footer.portalLink")}
          </Link>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t("header.brand")} · {t("footer.copy")}
      </div>
    </footer>
  );
}
