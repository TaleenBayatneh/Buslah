import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileSpreadsheet, CheckCircle2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/universities")({
  head: () => ({ meta: [{ title: "رفع بيانات الجامعة — بوصلة" }, { name: "description", content: "تعليمات وتنسيق ملف بيانات التخصصات لرفعها إلى قاعدة بيانات بوصلة." }] }),
  component: UniPage,
});

const N8N_WEBHOOK = (import.meta.env.VITE_N8N_UNIVERSITY_WEBHOOK_URL as string) || "http://localhost:5678/webhook/14ff4507-5050-4cf1-81db-f70d0aae1caa";

const COLUMNS: { key: string; label: string; example: string; note: string }[] = [
  { key: "university_name", label: "اسم الجامعة", example: "جامعة بيرزيت", note: "الاسم الرسمي الكامل للجامعة" },
  { key: "major_name", label: "اسم التخصص", example: "هندسة حاسوب", note: "اسم التخصص كما هو في دليل الجامعة" },
  { key: "duration_years", label: "مدة الدراسة (سنوات)", example: "5", note: "رقم فقط — مثال: 4 أو 5 أو 6" },
  { key: "credit_hour_fee", label: "رسوم الساعة", example: "180", note: "رقم فقط بالعملة (شيكل / دينار)" },
  { key: "min_acceptance_rate", label: "معدل القبول", example: "85.5", note: "النسبة المئوية كرقم — مثال: 85.5" },
];

function UniPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) { toast.error("اختر ملفاً أولاً"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("الحد الأقصى ١٠ ميغابايت"); return; }
    if (!N8N_WEBHOOK) { toast.error("رابط الويبهوك غير مهيأ بعد. يرجى التواصل مع فريق بوصلة."); return; }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("data0", file);  // IMPORTANT: Use "data0" to match n8n's Extract from File expectation
      fd.append("file_name", file.name);
      
      console.log("📤 Uploading to:", N8N_WEBHOOK);
      
      const res = await fetch(N8N_WEBHOOK, { 
        method: "POST", 
        body: fd,
      });
      
      const responseText = await res.text();
      console.log("✅ Response status:", res.status);
      console.log("📋 Response body:", responseText);
      
      if (!res.ok) {
        const errorData = responseText ? JSON.parse(responseText) : { message: `HTTP ${res.status}` };
        throw new Error(errorData.message || `فشل الإرسال: ${res.status}`);
      }
      
      toast.success("تم إرسال الملف بنجاح! سنراجع البيانات قريباً.");
      setDone(true);
      setFile(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "خطأ غير متوقع";
      console.error("❌ Upload error:", err);
      toast.error(`خطأ: ${msg}`);
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
            رفع بيانات <span className="text-gradient-compass font-serif">الجامعة</span>
          </h1>
          <p className="text-muted-foreground font-serif leading-relaxed max-w-2xl mx-auto">
            هذه الصفحة موجّهة للجامعات الراغبة بإضافة تخصصاتها إلى قاعدة بيانات بوصلة. يرجى تجهيز ملف Excel أو CSV وفق التنسيق المبيّن أدناه ثم رفعه في النموذج بالأسفل.
          </p>
        </div>

        {/* Required columns */}
        <section className="bg-card border border-border rounded-sm p-6 mb-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-academic mb-4 font-serif flex items-center gap-2">
            <FileSpreadsheet className="size-6" /> الأعمدة المطلوبة في الملف
          </h2>
          <p className="text-sm text-muted-foreground mb-4 font-serif">
            يجب أن يحتوي الملف على الأعمدة التالية بنفس الترتيب، مع صفّ عناوين في الأعلى:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-paper-dim border-b border-border">
                  <th className="text-right p-3 font-bold">اسم العمود</th>
                  <th className="text-right p-3 font-bold">المعرّف التقني</th>
                  <th className="text-right p-3 font-bold">مثال</th>
                  <th className="text-right p-3 font-bold">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {COLUMNS.map((c) => (
                  <tr key={c.key} className="border-b border-border last:border-0">
                    <td className="p-3 font-semibold">{c.label}</td>
                    <td className="p-3 font-mono text-xs text-muted-foreground" dir="ltr">{c.key}</td>
                    <td className="p-3" dir="ltr">{c.example}</td>
                    <td className="p-3 text-muted-foreground text-xs">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sample section removed per request */}

        {/* Upload form */}
        <section className="bg-card border border-border rounded-sm p-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-academic mb-4 font-serif flex items-center gap-2">
            <Upload className="size-6" /> رفع الملف
          </h2>
          {done ? (
            <div className="text-center py-8">
              <CheckCircle2 className="size-12 text-emerald-600 mx-auto mb-3" />
              <p className="font-semibold text-lg mb-1 font-serif">تم استلام ملفك بنجاح</p>
              <p className="text-muted-foreground text-sm mb-4 font-serif">سنراجع البيانات وندمجها في قاعدة بيانات بوصلة قريباً.</p>
              <Button variant="outline" onClick={() => setDone(false)}>رفع ملف آخر</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 font-serif">اختر الملف</label>
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
                  <><Loader2 className="size-4 ml-1 animate-spin" /> جاري الإرسال...</>
                ) : (
                  <><Upload className="size-4 ml-1" /> إرسال الملف</>
                )}
              </Button>
              <p className="text-xs text-muted-foreground font-serif">
                بإرسالك للملف فإنك توافق على دمج هذه البيانات في قاعدة بيانات بوصلة لخدمة طلاب التوجيهي.
              </p>
            </form>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}