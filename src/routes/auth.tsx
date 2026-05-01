import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "تسجيل الدخول — موجِّه" }] }),
  component: AuthPage,
});

const signUpSchema = z.object({
  full_name: z.string().trim().min(2, "الاسم قصير جداً").max(100),
  email: z.string().trim().email("بريد إلكتروني غير صالح").max(255),
  password: z.string().min(6, "كلمة السر ٦ أحرف على الأقل").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/chat" });
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("أهلاً بعودتك!");
      navigate({ to: "/chat" });
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signUpSchema.safeParse({
      full_name: fd.get("full_name"),
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/chat`,
        data: {
          full_name: parsed.data.full_name,
          account_type: "student",
        },
      },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("تم إنشاء حسابك! يمكنك الدخول الآن.");
    }
  };

  const [accType, setAccType] = useState<"student" | "university">("student");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-card border border-border rounded-sm shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl font-bold text-academic mb-2">مرحباً بك في موجِّه</h1>
            <p className="text-sm text-muted-foreground">سجّل حسابك أو ادخل كضيف من <Link to="/chat" className="text-academic font-semibold hover:underline">هنا</Link></p>
          </div>
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">دخول</TabsTrigger>
              <TabsTrigger value="signup">حساب جديد</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                <div><Label>البريد الإلكتروني</Label><Input name="email" type="email" required /></div>
                <div><Label>كلمة السر</Label><Input name="password" type="password" required /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "..." : "دخول"}</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                <div>
                  <Label className="mb-2 block">نوع الحساب</Label>
                  <RadioGroup value={accType} onValueChange={(v) => setAccType(v as "student" | "university")} name="account_type" className="grid grid-cols-2 gap-2">
                    <Label className="flex items-center gap-2 border border-border rounded-sm p-3 cursor-pointer has-[:checked]:bg-academic/5 has-[:checked]:border-academic">
                      <RadioGroupItem value="student" /> طالب
                    </Label>
                    <Label className="flex items-center gap-2 border border-border rounded-sm p-3 cursor-pointer has-[:checked]:bg-academic/5 has-[:checked]:border-academic">
                      <RadioGroupItem value="university" /> جامعة
                    </Label>
                  </RadioGroup>
                </div>
                <div><Label>الاسم الكامل</Label><Input name="full_name" required /></div>
                {accType === "university" && (
                  <div><Label>اسم الجامعة</Label><Input name="university_name" required /></div>
                )}
                <div><Label>البريد الإلكتروني</Label><Input name="email" type="email" required /></div>
                <div><Label>كلمة السر</Label><Input name="password" type="password" required minLength={6} /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "..." : "إنشاء حساب"}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}