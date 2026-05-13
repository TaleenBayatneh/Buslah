import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
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
  const [file, setFile] = useState<File | null>(null);
  const [universityName, setUniversityName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) { toast.error(t("unis.err.pick")); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error(t("unis.err.size")); return; }
    if (!N8N_WEBHOOK) { toast.error(t("unis.err.webhook")); return; }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("data0", file);
      fd.append("file_name", file.name);
      if (universityName.trim()) fd.append("university_name", universityName.trim());

      const res = await fetch(N8N_WEBHOOK, { method: "POST", body: fd });
      const responseText = await res.text();
      if (!res.ok) {
        const errorData = responseText ? JSON.parse(responseText) : { message: `HTTP ${res.status}` };
        throw new Error(errorData.message || `${t("unis.err.fail")}: ${res.status}`);
      }
      toast.success(t("unis.success"));
      setDone(true);
      setFile(null);
      setUniversityName("");
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
                <label className="block text-sm font-semibold mb-2 font-serif">{t("unis.uniName")}</label>
                <Input
                  type="text"
                  placeholder={t("unis.uniNamePh")}
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground mt-1 font-serif">
                  {t("unis.uniNameHint")}
                </p>
              </div>
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
