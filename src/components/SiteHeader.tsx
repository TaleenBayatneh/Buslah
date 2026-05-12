import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, MessageSquare, Upload, GraduationCap, Menu, Home, Info, Building2, MessagesSquare } from "lucide-react";
import { CompassLogo } from "@/components/CompassLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export function SiteHeader() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const isUniversity = profile?.account_type === "university";

  const navLinks = [
    { to: "/" as const, label: "الرئيسية", exact: true, icon: Home },
    { to: "/about" as const, label: "من نحن", icon: Info },
    { to: "/universities" as const, label: "بوابة الجامعات", icon: Building2 },
    { to: "/chat" as const, label: "الشات", icon: MessagesSquare },
  ];

  return (
    <header className="border-b border-border bg-background/75 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between font-serif">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="القائمة">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 font-serif">
              <SheetHeader>
                <SheetTitle className="text-gradient-compass font-display text-2xl text-right">بوصلة</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1 px-2">
                {navLinks.map((l) => (
                  <SheetClose asChild key={l.to}>
                    <Link
                      to={l.to}
                      activeOptions={l.exact ? { exact: true } : undefined}
                      activeProps={{ className: "bg-academic/10 text-academic" }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-bold text-foreground hover:bg-muted transition-colors"
                    >
                      <l.icon className="size-5 shrink-0" />
                      <span>{l.label}</span>
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center gap-2.5 group">
          <div className="size-9 bg-gradient-compass rounded-full flex items-center justify-center shadow-compass group-hover:scale-105 transition-transform overflow-hidden">
            <CompassLogo className="size-9 -m-0.5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-2xl font-bold text-gradient-compass font-serif">بوصلة</span>
            <span className="text-[10px] text-muted-foreground tracking-widest mt-0.5">BOSLAH · فلسطين</span>
          </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={l.exact ? { exact: true } : undefined}
              activeProps={{ className: "text-academic" }}
              className="inline-flex items-center gap-1.5 hover:text-academic transition-colors"
            >
              <l.icon className="size-4" />
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
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
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
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