import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { CompassLogo } from "@/components/CompassLogo";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "الشات الإرشادي — بوصلة" }] }),
  component: ChatPage,
});

interface Msg { id: string; role: "user" | "assistant"; content: string; }

const N8N_CHAT_WEBHOOK_URL = import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL as string | undefined;

function ChatPage() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Msg[]>([
    { id: "init", role: "assistant", content: t("chat.init") },
  ]);
  const [input, setInput] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);

    try {
      if (!N8N_CHAT_WEBHOOK_URL) {
        setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: t("chat.notLinked") }]);
        return;
      }

      const payload = {
        text,
        userId: "guest",
        userName: "guest",
        universityName: universityName || undefined,
        ...(sessionId && { sessionId }),
      };

      const res = await fetch(N8N_CHAT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json().catch(() => ({}));
      if (data.sessionId && !sessionId) setSessionId(data.sessionId);

      const reply = (data.reply || data.output || data.text || data.message || t("chat.received")) as string;
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: reply }]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : t("unis.err.unknown");
      toast.error(`${t("chat.connectErr")}: ${errorMsg}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 py-6">
        <div className="bg-card border border-border rounded-sm shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="bg-paper-dim border-b border-border px-5 py-3 flex items-center gap-3">
            <div className="size-9 rounded-full bg-gradient-compass flex items-center justify-center shrink-0">
              <CompassLogo className="size-6" />
            </div>
            <div>
              <div className="font-display text-base font-bold text-foreground leading-tight">{t("chat.botName")}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5"><span className="size-1.5 bg-emerald-500 rounded-full" /> {t("chat.role")}</div>
            </div>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 min-h-[60vh]">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`size-9 rounded-full flex items-center justify-center shrink-0 ${m.role === "assistant" ? "bg-gradient-compass" : "bg-paper-dim border border-border"}`}>
                  {m.role === "assistant"
                    ? <CompassLogo className="size-5" animated={false} />
                    : <span className="text-sm font-bold">{t("lang.toggle") === "العربية" ? "U" : "أ"}</span>}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[80%] whitespace-pre-wrap ${m.role === "assistant" ? "bg-paper-dim border border-border rounded-tr-sm" : "bg-academic/10 border border-academic/20 rounded-tl-sm"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex gap-3"><div className="size-9 rounded-full bg-gradient-compass flex items-center justify-center"><Loader2 className="size-4 text-primary-foreground animate-spin" /></div><div className="p-3 bg-paper-dim border border-border rounded-2xl rounded-tr-sm text-sm">{t("chat.thinking")}</div></div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t border-border p-3 space-y-2 bg-paper-dim">
            <Input value={universityName} onChange={(e) => setUniversityName(e.target.value)} placeholder={t("chat.uniPlaceholder")} disabled={sending} className="bg-card text-sm" />
            <div className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("chat.askPlaceholder")} disabled={sending} className="flex-1 bg-card" />
              <Button type="submit" disabled={sending || !input.trim()}><Send className="size-4" /></Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
