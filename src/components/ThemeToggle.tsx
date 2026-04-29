import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button
      onClick={toggle}
      variant="ghost"
      size="icon"
      title={theme === "dark" ? "وضع النهار" : "الوضع الليلي"}
      aria-label="تبديل المظهر"
      className="relative overflow-hidden"
    >
      <Sun className={`size-4 transition-all ${theme === "dark" ? "scale-0 rotate-90" : "scale-100 rotate-0"}`} />
      <Moon className={`size-4 absolute transition-all ${theme === "dark" ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`} />
    </Button>
  );
}