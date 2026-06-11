import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { Mail, Lock, User, UserCheck } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "إنشاء حساب — بوصلة" }, { name: "description", content: "إنشاء حساب جديد كطالب أو جامعة" }] }),
  component: SignupPage,
});

function SignupPage() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  
  const [role, setRole] = useState<"student" | "university">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!fullName.trim()) {
      toast.error(t("signup.err.name"));
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error(t("signup.err.email"));
      return;
    }
    if (!username.trim()) {
      toast.error(t("signup.err.username"));
      return;
    }
    if (password.length < 6) {
      toast.error(t("signup.err.pass"));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t("signup.err.passMatch"));
      return;
    }

    setLoading(true);
    try {
      console.log("🔍 Starting signup with:", { email: email.toLowerCase(), username: username.toLowerCase(), role });
      
      const { error: signUpError, data } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName,
            username: username.toLowerCase(),
            account_type: role,
          },
        },
      });

      console.log("✅ Signup response:", { error: signUpError, data });

      if (signUpError) {
        console.error("❌ Signup error:", signUpError);
        throw signUpError;
      }

      console.log("✅ Signup successful, user created");
      toast.success(t("signup.success"));
      
      // Redirect to login
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 1500);
    } catch (err) {
      console.error("❌ Exception caught:", err);
      const msg = err instanceof Error ? err.message : t("signup.err.unknown");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2 font-serif">
              {t("signup.title")}
            </h1>
            <p className="text-muted-foreground font-serif">
              {t("signup.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSignup} className="bg-card border border-border rounded-sm p-6 space-y-4 shadow-sm">
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-semibold mb-2 font-serif">
                {t("signup.role")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`p-3 rounded border-2 text-center font-serif transition ${
                    role === "student"
                      ? "border-academic bg-academic/10"
                      : "border-border hover:border-academic/50"
                  }`}
                >
                  <User className="size-5 mx-auto mb-1" />
                  <div className="text-sm font-semibold">{t("signup.student")}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("university")}
                  className={`p-3 rounded border-2 text-center font-serif transition ${
                    role === "university"
                      ? "border-academic bg-academic/10"
                      : "border-border hover:border-academic/50"
                  }`}
                >
                  <UserCheck className="size-5 mx-auto mb-1" />
                  <div className="text-sm font-semibold">{t("signup.uni")}</div>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold mb-1 font-serif">
                {t("signup.name")}
              </label>
              <Input
                type="text"
                placeholder={t("signup.namePh")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                className="bg-background"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-1 font-serif">
                {t("signup.email")}
              </label>
              <Input
                type="email"
                placeholder={t("signup.emailPh")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-background"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold mb-1 font-serif">
                {t("signup.username")}
              </label>
              <Input
                type="text"
                placeholder={t("signup.usernamePh")}
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                disabled={loading}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground mt-1 font-serif">
                {t("signup.usernameHint")}
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-1 font-serif">
                {t("signup.pass")}
              </label>
              <Input
                type="password"
                placeholder={t("signup.passPh")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground mt-1 font-serif">
                {t("signup.passHint")}
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold mb-1 font-serif">
                {t("signup.confirmPass")}
              </label>
              <Input
                type="password"
                placeholder={t("signup.confirmPassPh")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="bg-background"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? t("signup.loading") : t("signup.btn")}
            </Button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground font-serif">
              {t("signup.hasAccount")}{" "}
              <a href="/login" className="text-academic hover:underline font-semibold">
                {t("signup.login")}
              </a>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
