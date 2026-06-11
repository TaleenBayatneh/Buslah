import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { CheckCircle, XCircle, Clock, Download } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "لوحة الإدارة — بوصلة" }, { name: "description", content: "لوحة تحكم الإداريين" }] }),
  component: AdminPage,
});

interface UniversityUpload {
  id: string;
  university_name: string;
  file_name: string;
  file_size: number | null;
  notes: string | null;
  status: "pending" | "processing" | "processed" | "rejected" | "error";
  created_at: string;
  user_id: string;
}

function AdminPageContent() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { isAdmin, profile, loading: authLoading } = useAuth();
  
  const [uploads, setUploads] = useState<UniversityUpload[]>([]);
  const [loading, setLoading] = useState(true);

  // Load pending uploads
  useEffect(() => {
    const loadUploads = async () => {
      try {
        const { data, error } = await supabase
          .from("university_uploads")
          .select("*")
          .in("status", ["pending", "error"])
          .order("created_at", { ascending: false });

        if (error) throw error;
        setUploads((data as UniversityUpload[]) || []);
      } catch (err) {
        console.error("Failed to load uploads:", err);
        toast.error(t("admin.err.loadFailed"));
      } finally {
        setLoading(false);
      }
    };

    loadUploads();
  }, [t]);

  const handleApprove = async (uploadId: string) => {
    try {
      // Get the upload details
      const upload = uploads.find(u => u.id === uploadId);
      if (!upload) {
        toast.error(t("admin.err.notFound"));
        return;
      }

      // Update status to processing first
      const { error: updateError } = await supabase
        .from("university_uploads")
        .update({ status: "processing" })
        .eq("id", uploadId);

      if (updateError) throw updateError;

      // Send to n8n webhook
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const filePath = upload.file_path || `university-data/${upload.user_id}/${upload.file_name}`;
      const fileUrl = `${supabaseUrl}/storage/v1/object/public/${filePath}`;

      const webhookUrl = import.meta.env.VITE_N8N_UNIVERSITY_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error("N8N webhook URL not configured");
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upload_id: uploadId,
          file_name: upload.file_name,
          file_path: filePath,
          file_url: fileUrl,
          university_name: upload.university_name,
          file_size: upload.file_size || 0,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`N8N webhook failed: ${response.statusText}`);
      }

      toast.success(t("admin.approveSuccess"));
      
      // Remove from list
      setUploads(uploads.filter(u => u.id !== uploadId));
    } catch (err) {
      // Update status to error if webhook fails
      try {
        const upload = uploads.find(u => u.id === uploadId);
        if (upload) {
          await supabase
            .from("university_uploads")
            .update({ 
              status: "error",
              notes: err instanceof Error ? err.message : "Failed to send to n8n"
            })
            .eq("id", uploadId);
        }
      } catch (updateErr) {
        console.error("Failed to update status to error:", updateErr);
      }
      
      console.error("Failed to approve upload:", err);
      toast.error(t("admin.err.approveFailed"));
    }
  };

  const handleReject = async (uploadId: string) => {
    try {
      const { error } = await supabase
        .from("university_uploads")
        .update({ status: "rejected" })
        .eq("id", uploadId);

      if (error) throw error;

      toast.success(t("admin.rejectSuccess"));
      setUploads(uploads.filter(u => u.id !== uploadId));
    } catch (err) {
      console.error("Failed to reject upload:", err);
      toast.error(t("admin.err.rejectFailed"));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="size-5 text-orange-500" />;
      case "processing":
        return <Clock className="size-5 text-blue-500 animate-spin" />;
      case "processed":
        return <CheckCircle className="size-5 text-green-500" />;
      case "rejected":
        return <XCircle className="size-5 text-red-500" />;
      default:
        return <Clock className="size-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: t("admin.status.pending"),
      processing: t("admin.status.processing"),
      processed: t("admin.status.processed"),
      rejected: t("admin.status.rejected"),
      error: t("admin.status.error"),
    };
    return labels[status] || status;
  };

  if (authLoading) {
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
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-2 font-serif">
              {t("admin.title")}
            </h1>
            <p className="text-muted-foreground font-serif">
              {t("admin.subtitle")}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-block animate-spin rounded-full size-8 border-2 border-border border-t-academic" />
            </div>
          ) : uploads.length === 0 ? (
            <Card>
              <CardContent className="pt-12 text-center">
                <p className="text-muted-foreground">{t("admin.noUploads")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {uploads.map((upload) => (
                <Card key={upload.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(upload.status)}
                          <CardTitle className="font-serif">{upload.university_name}</CardTitle>
                        </div>
                        <CardDescription className="font-serif">
                          {upload.file_name} • {upload.file_size ? `${(upload.file_size / 1024 / 1024).toFixed(2)} MB` : "N/A"}
                        </CardDescription>
                      </div>
                      <span className="text-xs text-muted-foreground font-serif">
                        {new Date(upload.created_at).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                      </span>
                    </div>
                  </CardHeader>
                  
                  {upload.notes && (
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground font-serif">{t("admin.notes")}: {upload.notes}</p>
                    </CardContent>
                  )}

                  <CardContent className="pt-4 border-t">
                    <div className="flex gap-2 justify-end">
                      {upload.status === "pending" && (
                        <>
                          <Button
                            onClick={() => handleReject(upload.id)}
                            variant="outline"
                            className="gap-2 font-serif"
                          >
                            <XCircle className="size-4" />
                            {t("admin.reject")}
                          </Button>
                          <Button
                            onClick={() => handleApprove(upload.id)}
                            className="gap-2 font-serif"
                          >
                            <CheckCircle className="size-4" />
                            {t("admin.approve")}
                          </Button>
                        </>
                      )}
                      {upload.status === "error" && (
                        <Button
                          onClick={() => handleApprove(upload.id)}
                          className="gap-2 font-serif"
                        >
                          <CheckCircle className="size-4" />
                          {t("admin.retry")}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 font-serif"
                        disabled
                      >
                        <Download className="size-4" />
                        {t("admin.download")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminPageContent />
    </ProtectedRoute>
  );
}
