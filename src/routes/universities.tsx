import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileSpreadsheet, CheckCircle2, Loader2 } from "lucide-react";
import { useI18n, type TKey } from "@/lib/i18n";

export const Route = createFileRoute("/universities")({
  head: () => ({ meta: [{ title: "رفع بيانات الجامعة — بوصلة" }, { name: "description", content: "تعليمات وتنسيق ملف بيانات التخصصات لرفعها إلى قاعدة بيانات بوصلة." }] }),
  component: UniPage,
});

const N8N_WEBHOOK = (import.meta.env.VITE_N8N_UNIVERSITY_WEBHOOK_URL as string) || "http://localhost:5678/webhook/14ff4507-5050-4cf1-81db-f70d0aae1caa";

const COLUMNS: { key: string; labelAr: string; labelEn: string; example: string; noteAr: string; noteEn: string }[] = [
  { key: "university_name", labelAr: "اسم الجامعة", labelEn: "University name", example: "جامعة بيرزيت", noteAr: "الاسم الرسمي الكامل للجامعة", noteEn: "Full official university name" },
  { key: "major_name", labelAr: "اسم التخصص", labelEn: "Major name", example: "هندسة حاسوب", noteAr: "اسم التخصص كما هو في دليل الجامعة", noteEn: "Major name as in the university catalog" },
  { key: "duration_years", labelAr: "مدة الدراسة (سنوات)", labelEn: "Duration (years)", example: "5", noteAr: "رقم فقط — مثال: 4 أو 5 أو 6", noteEn: "Number only — e.g. 4, 5, or 6" },
  { key: "credit_hour_fee", labelAr: "رسوم الساعة", labelEn: "Credit hour fee", example: "180", noteAr: "رقم فقط بالعملة (شيكل / دينار)", noteEn: "Number only in currency (NIS / JOD)" },
  { key: "min_acceptance_rate", labelAr: "معدل القبول", labelEn: "Acceptance rate", example: "85.5", noteAr: "النسبة المئوية كرقم — مثال: 85.5", noteEn: "Percentage as a number — e.g. 85.5" },
];

function UniPage() {
  const { t, lang } = useI18n();
  const { user, isUniversity, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  // Redirect if not a university
  if (isAuthenticated() && !isUniversity()) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="font-display text-2xl font-bold mb-4 font-serif">{t("unis.notAllowed") || "Access Denied"}</h1>
            <p className="text-muted-foreground mb-6 font-serif">
              {t("unis.universitiesOnly") || "This page is for university users only"}
            </p>
            <Button onClick={() => navigate({ to: "/" })}>
              {t("nav.home")}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Show loading or redirect to login if not authenticated
  if (!isAuthenticated() || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full size-8 border-2 border-border border-t-academic" />
          </div>
        </main>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(t("unis.err.auth"));
      return;
    }

    if (!file) { 
      toast.error(t("unis.err.pick")); 
      return; 
    }

    if (file.size > 10 * 1024 * 1024) { 
      toast.error(t("unis.err.size")); 
      return; 
    }

    setUploading(true);
    try {
      // Sanitize filename for storage (remove special chars)
      const sanitizedName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, '_')  // Replace non-ASCII with underscore
        .replace(/_{2,}/g, '_')            // Replace multiple underscores with single
        .substring(0, 50);                 // Limit length
      
      const timestamp = Date.now();
      const storageName = `${timestamp}_${sanitizedName}`;
      const filePath = `university-data/${user.id}/${storageName}`;
      
      const { error: uploadError } = await supabase.storage
        .from("university-data")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create pending upload record in database
      const { error: dbError } = await supabase
        .from("university_uploads")
        .insert({
          user_id: user.id,
          university_name: "تم تحميل الملف",
          file_name: file.name,  // Store original filename for display
          file_size: file.size,
          file_path: filePath,   // Store sanitized storage path
          status: "pending",
          notes: "في انتظار موافقة الإداري",
        });

      if (dbError) throw dbError;

      toast.success(t("unis.success"));
      setDone(true);
      setFile(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("unis.err.unknown");
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold mb-3 font-serif">
            {t("unis.title1")} <span className="text-gradient-compass font-serif">{t("unis.title2")}</span>
          </h1>
          <p className="text-muted-foreground font-serif leading-relaxed max-w-2xl mx-auto">
            {t("unis.subtitle")}
          </p>
        </div>

        <section className="bg-card border border-border rounded-sm p-6 mb-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-academic mb-4 font-serif flex items-center gap-2">
            <FileSpreadsheet className="size-6" /> {t("unis.cols")}
          </h2>
          <p className="text-sm text-muted-foreground mb-4 font-serif">
            {t("unis.colsHint")}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-paper-dim border-b border-border">
                  <th className="text-right p-3 font-bold">{t("unis.h.col")}</th>
                  <th className="text-right p-3 font-bold">{t("unis.h.key")}</th>
                  <th className="text-right p-3 font-bold">{t("unis.h.ex")}</th>
                  <th className="text-right p-3 font-bold">{t("unis.h.note")}</th>
                </tr>
              </thead>
              <tbody>
                {COLUMNS.map((c) => (
                  <tr key={c.key} className="border-b border-border last:border-0">
                    <td className="p-3 font-semibold">{lang === "en" ? c.labelEn : c.labelAr}</td>
                    <td className="p-3 font-mono text-xs text-muted-foreground" dir="ltr">{c.key}</td>
                    <td className="p-3" dir="ltr">{c.example}</td>
                    <td className="p-3 text-muted-foreground text-xs">{lang === "en" ? c.noteEn : c.noteAr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-card border border-border rounded-sm p-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-academic mb-4 font-serif flex items-center gap-2">
            <Upload className="size-6" /> {t("unis.upload")}
          </h2>
          {done ? (
            <div className="text-center py-8">
              <CheckCircle2 className="size-12 text-emerald-600 mx-auto mb-3" />
              <p className="font-semibold text-lg mb-1 font-serif">{t("unis.done.t")}</p>
              <p className="text-muted-foreground text-sm mb-4 font-serif">{t("unis.done.x")}</p>
              <Button variant="outline" onClick={() => setDone(false)}>{t("unis.done.again")}</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 font-serif">{t("unis.pickFile")}</label>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  required
                  className="bg-background"
                />
                {file && (
                  <p className="text-xs text-muted-foreground mt-2" dir="ltr">
                    {file.name} — {(file.size / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
              <Button type="submit" disabled={uploading || !file} className="w-full sm:w-auto">
                {uploading ? (
                  <><Loader2 className="size-4 ml-1 animate-spin" /> {t("unis.sending")}</>
                ) : (
                  <><Upload className="size-4 ml-1" /> {t("unis.sendBtn")}</>
                )}
              </Button>
              <p className="text-xs text-muted-foreground font-serif">
                {t("unis.disclaimer")}
              </p>
            </form>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
