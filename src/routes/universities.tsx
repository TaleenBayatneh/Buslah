import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MapPin, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/universities")({
  head: () => ({ meta: [{ title: "دليل الجامعات — بوصلة" }, { name: "description", content: "تصفّح الجامعات الفلسطينية المتاحة في قاعدة بيانات بوصلة." }] }),
  component: UniPage,
});

interface Uni { id: string; name: string; city: string | null; type: string | null; website: string | null; description: string | null; }

function UniPage() {
  const [list, setList] = useState<Uni[]>([]);
  useEffect(() => {
    supabase.from("universities").select("*").order("name").then(({ data }) => setList((data as Uni[]) ?? []));
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl font-bold mb-2">دليل <span className="text-gradient-compass">الجامعات الفلسطينية</span></h1>
        <p className="text-muted-foreground mb-8">الجامعات الفلسطينية المتاحة حالياً في قاعدة بيانات بوصلة.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((u) => (
            <div key={u.id} className="bg-card border border-border rounded-sm p-5 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-display text-lg font-bold text-academic">{u.name}</h3>
                <span className="text-xs bg-paper-dim border border-border px-2 py-0.5 rounded-sm">{u.type === "public" ? "حكومية" : "خاصة"}</span>
              </div>
              {u.city && <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2"><MapPin className="size-3" /> {u.city}</p>}
              {u.description && <p className="text-sm text-foreground/80 mb-3 leading-relaxed">{u.description}</p>}
              {u.website && <a href={u.website} target="_blank" rel="noreferrer" className="text-sm text-academic font-semibold inline-flex items-center gap-1 hover:underline"><ExternalLink className="size-3" /> الموقع الرسمي</a>}
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}