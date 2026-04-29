import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react";

export const Route = createFileRoute("/university")({
  head: () => ({ meta: [{ title: "لوحة الجامعة — موجِّه" }] }),
  component: UniDashboard,
});

const N8N_UNI_WEBHOOK = import.meta.env.VITE_N8N_UNIVERSITY_WEBHOOK_URL as string | undefined;

interface UploadRow { id: string; file_name: string; status: string; created_at: string; }

function UniDashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState<UploadRow[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const fetchUploads = async () => {
    if (!user) return;
    const { data } = await supabase.from("university_uploads").select("id, file_name, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false });
    setUploads((data as UploadRow[]) ?? []);
  };
  useEffect(() => { fetchUploads(); }, [user]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  if (profile && profile.account_type !== "university") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h1 className="font-display text-2xl font-bold text-academic mb-2">هذه الصفحة مخصصة للجامعات</h1>
            <p className="text-muted-foreground mb-4">حسابك مسجّل كطالب. لاستخدام هذه اللوحة، أنشئ حساباً جديداً كجامعة.</p>
            <Button asChild><Link to="/chat">العودة للشات</Link></Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file") as File | null;
    if (!file || !file.name) { toast.error("اختر ملفاً أولاً"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("الحد الأقصى ١٠ ميغابايت"); return; }

    setUploading(true);
    try {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("university-data").upload(path, file);
      if (upErr) throw upErr;

      const { data: signed } = await supabase.storage.from("university-data").createSignedUrl(path, 3600);

      const { error: insErr } = await supabase.from("university_uploads").insert({
        user_id: user.id,
        university_name: profile?.university_name ?? "غير محدد",
        file_path: path,
        file_name: file.name,
        file_size: file.size,
        status: "pending",
      });
      if (insErr) throw insErr;

      // Notify n8n workflow
      if (N8N_UNI_WEBHOOK) {
        fetch(N8N_UNI_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            university: profile?.university_name,
            userId: user.id,
            filePath: path,
            fileName: file.name,
            signedUrl: signed?.signedUrl,
          }),
        }).catch(() => {});
      }

      toast.success("تم رفع الملف بنجاح! ستتم معالجته قريباً.");
      (e.target as HTMLFormElement).reset();
      fetchUploads();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ في رفع الملف";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full">
        <h1 className="font-display text-3xl font-bold text-academic mb-1">لوحة تحكم الجامعة</h1>
        <p className="text-muted-foreground mb-8">{profile?.university_name ?? "—"}</p>

        <form onSubmit={handleUpload} className="bg-card border border-border rounded-sm p-6 mb-8 shadow-sm">
          <h2 className="font-display text-xl font-bold text-academic mb-3 flex items-center gap-2"><Upload className="size-5" /> رفع بيانات جديدة</h2>
          <p className="text-sm text-muted-foreground mb-4">ارفع ملف Excel أو CSV يحتوي على التخصصات، الرسوم، ومعدلات القبول. سيتم تحويله تلقائياً إلى قاعدة بيانات الشات بوت.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input name="file" type="file" accept=".csv,.xlsx,.xls,.json" required className="bg-background" />
            <Button type="submit" disabled={uploading}>
              {uploading ? <><Loader2 className="size-4 ml-1 animate-spin" /> جاري الرفع...</> : "رفع الملف"}
            </Button>
          </div>
        </form>

        <div className="bg-card border border-border rounded-sm p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-academic mb-4">الملفات المرفوعة</h2>
          {uploads.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">لا توجد ملفات مرفوعة بعد.</p>
          ) : (
            <ul className="divide-y divide-border">
              {uploads.map((u) => (
                <li key={u.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="size-5 text-academic" />
                    <div>
                      <p className="font-medium text-sm">{u.file_name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleString("ar-JO")}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-sm border ${u.status === "processed" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : u.status === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-paper-dim border-border text-muted-foreground"}`}>
                    {u.status === "pending" ? "قيد الانتظار" : u.status === "processing" ? "قيد المعالجة" : u.status === "processed" ? "تمت المعالجة" : "خطأ"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}