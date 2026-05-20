import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, toggle } = useI18n();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      title={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      aria-label="language"
    >
      <Languages className="size-4" />
    </Button>
  );
}
