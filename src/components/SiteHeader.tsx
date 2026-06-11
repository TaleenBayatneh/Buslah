import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Menu, Home, Info, Building2, MessagesSquare, LogOut, User, Shield } from "lucide-react";
import { CompassLogo } from "@/components/CompassLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const { user, profile, role, isAuthenticated, isAdmin, isUniversity, isStudent, signOut } = useAuth();

  const navLinks = [
    { to: "/" as const, labelKey: "nav.home" as const, exact: true, icon: Home },
    { to: "/about" as const, labelKey: "nav.about" as const, icon: Info },
    // Show universities upload page only to university users
    ...(isUniversity() ? [{ to: "/universities" as const, labelKey: "nav.universities" as const, icon: Building2 }] : []),
    // Show chat only to students and admins (not university users)
    ...(!isUniversity() ? [{ to: "/chat" as const, labelKey: "nav.chat" as const, icon: MessagesSquare }] : []),
    // Show admin panel only to admins
    ...(isAdmin() ? [{ to: "/admin" as const, labelKey: "nav.admin" as const, icon: Shield }] : []),
  ];

  const handleLogout = async () => {
    await signOut();
  };

  const getRoleBadge = () => {
    const roleConfig: Record<string, { label: string; color: string; icon: any }> = {
      student: { label: t("signup.student"), color: "bg-blue-100 text-blue-700", icon: User },
      university: { label: t("signup.uni"), color: "bg-purple-100 text-purple-700", icon: Building2 },
      admin: { label: t("login.admin"), color: "bg-red-100 text-red-700", icon: Shield },
    };

    const config = roleConfig[role || "student"];
    if (!config) return null;

    const IconComponent = config.icon;
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${config.color}`}>
        <IconComponent className="size-3" />
        {config.label}
      </div>
    );
  };

  return (
    <header className="border-b border-border bg-background/75 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between font-serif">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label={t("header.menu")}>
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 font-serif">
              <SheetHeader>
                <SheetTitle className="text-gradient-compass font-display text-2xl text-right">{t("header.brand")}</SheetTitle>
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
                      <span>{t(l.labelKey)}</span>
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
              <span className="font-display text-2xl font-bold text-gradient-compass font-serif">{t("header.brand")}</span>
              <span className="text-[10px] text-muted-foreground tracking-widest mt-0.5">{t("header.brandSub")}</span>
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
              <span>{t(l.labelKey)}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />

          {isAuthenticated() ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="size-4" />
                  <span className="hidden sm:inline">{profile?.full_name || profile?.username || "User"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 font-serif">
                <DropdownMenuLabel className="text-center">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{profile?.full_name}</span>
                    <span className="text-xs text-muted-foreground">@{profile?.username}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1 text-center">
                  {getRoleBadge()}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="size-4 ml-1" />
                  تسجيل الخروج / Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/login">تسجيل الدخول / Sign In</Link>
              </Button>
              <Button asChild size="sm" className="hidden sm:flex">
                <Link to="/signup">إنشاء حساب / Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
