import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, MessageSquare, Upload, GraduationCap } from "lucide-react";

export function SiteHeader() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const isUniversity = profile?.account_type === "university";

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 bg-academic rounded-sm flex items-center justify-center shadow-sm">
            <span className="font-display text-primary-foreground text-xl font-bold leading-none -mt-1">م</span>
          </div>
          <span className="font-display text-2xl font-bold text-academic">موجِّه</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-academic" }} className="hover:text-academic transition-colors">
            الرئيسية
          </Link>
          <Link to="/about" activeProps={{ className: "text-academic" }} className="hover:text-academic transition-colors">
            من نحن
          </Link>
          <Link to="/universities" activeProps={{ className: "text-academic" }} className="hover:text-academic transition-colors">
            دليل الجامعات
          </Link>
          <Link to="/chat" activeProps={{ className: "text-academic" }} className="hover:text-academic transition-colors">
            الشات
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isUniversity && (
                <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                  <Link to="/university"><Upload className="size-4 ml-1" />لوحة الجامعة</Link>
                </Button>
              )}
              <Button asChild size="sm" variant="default">
                <Link to="/chat"><MessageSquare className="size-4 ml-1" />ابدأ الشات</Link>
              </Button>
              <Button onClick={handleSignOut} variant="ghost" size="icon" title="تسجيل الخروج">
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">تسجيل الدخول</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/chat"><GraduationCap className="size-4 ml-1" />جرّب كضيف</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}