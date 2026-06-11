import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { Mail, Lock, LogIn } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "تسجيل الدخول — بوصلة" }, { name: "description", content: "تسجيل دخول لطلاب وجامعات وإداريين" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  
  const [loginType, setLoginType] = useState<"user" | "admin">("user");
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        navigate({ to: "/" });
      }
      setIsCheckingAuth(false);
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usernameOrEmail.trim()) {
      toast.error(t("login.err.email"));
      return;
    }
    if (!password) {
      toast.error(t("login.err.pass"));
      return;
    }

    setLoading(true);
    try {
      const email = usernameOrEmail.toLowerCase();

      let adminName = "";
      if (loginType === "admin") {
        // Admin: verify email exists in admin_emails table and get the name
        const { data: adminCheck } = await supabase
          .from("admin_emails")
          .select("email, name")
          .eq("email", email)
          .maybeSingle();

        if (!adminCheck) {
          toast.error(t("login.err.notAdmin") || "This email is not registered as admin");
          setLoading(false);
          return;
        }
        adminName = adminCheck.name || "";
      }

      // Regular sign in for both admin and user
      let { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If sign in fails and it's admin, try to sign up
      if (error && loginType === "admin") {
        const { error: signupError, data: signupData } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: adminName,
              username: adminName.toLowerCase().replace(/\s+/g, "_"),
              account_type: "admin",
            },
          },
        });
        
        if (signupError) throw signupError;
        data = signupData;
      } else if (error) {
        throw error;
      }

      if (data?.session) {
        // If admin, ensure role is set in user_roles table
        if (loginType === "admin" && data.user?.id) {
          const { data: existingRole } = await supabase
            .from("user_roles")
            .select("id")
            .eq("user_id", data.user.id)
            .maybeSingle();

          if (!existingRole) {
            await supabase
              .from("user_roles")
              .insert({
                user_id: data.user.id,
                role: "admin",
              });
          }
        }

        toast.success(t("login.success"));
        // Give it a moment for context to update, then navigate
        setTimeout(() => {
          navigate({ to: "/" });
        }, 500);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("login.err.unknown");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full size-8 border-2 border-border border-t-academic" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2 font-serif">
              {t("login.title")}
            </h1>
            <p className="text-muted-foreground font-serif">
              {t("login.subtitle")}
            </p>
          </div>

          {/* Login Type Tabs */}
          <div className="flex gap-2 mb-6 bg-paper-dim p-1 rounded">
            <button
              onClick={() => setLoginType("user")}
              className={`flex-1 py-2 rounded text-sm font-semibold font-serif transition ${
                loginType === "user"
                  ? "bg-academic text-primary-foreground"
                  : "hover:bg-paper-dim"
              }`}
            >
              {t("login.student")}
            </button>
            <button
              onClick={() => setLoginType("admin")}
              className={`flex-1 py-2 rounded text-sm font-semibold font-serif transition ${
                loginType === "admin"
                  ? "bg-academic text-primary-foreground"
                  : "hover:bg-paper-dim"
              }`}
            >
              {t("login.admin")}
            </button>
          </div>

          <form onSubmit={handleLogin} className="bg-card border border-border rounded-sm p-6 space-y-4 shadow-sm">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold mb-1 font-serif">
                {t("login.email")}
              </label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder={t("login.emailPh")}
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value.toLowerCase())}
                  disabled={loading}
                  className="bg-background pl-10"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold mb-1 font-serif">
                {t("login.pass")}
              </label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder={t("login.passPh")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="bg-background pl-10"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                t("login.loading")
              ) : (
                <>
                  <LogIn className="size-4 ml-1" />
                  {t("login.btn")}
                </>
              )}
            </Button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground font-serif">
              {t("login.noAccount")}{" "}
              <a href="/signup" className="text-academic hover:underline font-semibold">
                {t("login.signup")}
              </a>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
