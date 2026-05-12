import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { CompassLogo } from "@/components/CompassLogo";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "الشات الإرشادي — بوصلة" }] }),
  component: ChatPage,
});

interface Msg { id: string; role: "user" | "assistant"; content: string; }

const N8N_CHAT_WEBHOOK_URL = import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL as string | undefined;

function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([
    { id: "init", role: "assistant", content: "أهلاً وسهلاً فيك في بوصلة! 🧭 أنا مرشدك الذكي لاختيار تخصصك الجامعي. خبّرني عن حالك: شو فرعك في التوجيهي ومعدلك؟" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // create conversation for logged-in users
  useEffect(() => {
    if (!user || convId) return;
    supabase.from("chat_conversations").insert({ user_id: user.id, title: "محادثة جديدة" }).select().single()
      .then(({ data }) => { if (data) setConvId(data.id); });
  }, [user, convId]);

  const persist = async (role: "user" | "assistant", content: string) => {
    if (!convId) return;
    await supabase.from("chat_messages").insert({ conversation_id: convId, role, content });
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);
    persist("user", text);

    try {
      if (!N8N_CHAT_WEBHOOK_URL) {
        const fallback = "⚠️ لم يتم ربط الشات بـ n8n بعد. أضف عنوان الـ webhook في إعدادات المشروع لتفعيل الردود الذكية.";
        setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: fallback }]);
        return;
      }
      
      console.log("📤 Sending message to n8n chat webhook:", N8N_CHAT_WEBHOOK_URL);
      
      const res = await fetch(N8N_CHAT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: text,
          userId: user?.id ?? "guest",
          conversationId: convId,
          userName: user?.email ?? "ضيف"
        }),
      });
      
      if (!res.ok) {
        console.error("❌ n8n webhook error:", res.status, res.statusText);
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json().catch(() => ({}));
      console.log("✅ Response from n8n:", data);
      
      const reply = (data.reply || data.output || data.text || data.message || "تم استلام رسالتك.") as string;
      const botMsg: Msg = { id: crypto.randomUUID(), role: "assistant", content: reply };
      setMessages((m) => [...m, botMsg]);
      persist("assistant", reply);
    } catch (err) {
      console.error("❌ Chat error:", err);
      const errorMsg = err instanceof Error ? err.message : "خطأ غير متوقع";
      toast.error(`تعذّر الاتصال بالمساعد: ${errorMsg}`);
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
              <div className="font-display text-base font-bold text-foreground leading-tight">بوصلة</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5"><span className="size-1.5 bg-emerald-500 rounded-full" /> مرشدك الأكاديمي · متصل</div>
            </div>
            {!user && <span className="mr-auto text-xs text-muted-foreground bg-card border border-border px-2 py-1 rounded-full">جلسة ضيف</span>}
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 min-h-[60vh]">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`size-9 rounded-full flex items-center justify-center shrink-0 ${m.role === "assistant" ? "bg-gradient-compass" : "bg-paper-dim border border-border"}`}>
                  {m.role === "assistant"
                    ? <CompassLogo className="size-5" animated={false} />
                    : <span className="text-sm font-bold">أ</span>}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[80%] whitespace-pre-wrap ${m.role === "assistant" ? "bg-paper-dim border border-border rounded-tr-sm" : "bg-academic/10 border border-academic/20 rounded-tl-sm"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex gap-3"><div className="size-9 rounded-full bg-gradient-compass flex items-center justify-center"><Loader2 className="size-4 text-primary-foreground animate-spin" /></div><div className="p-3 bg-paper-dim border border-border rounded-2xl rounded-tr-sm text-sm">بوصلة بتفكر...</div></div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t border-border p-3 flex gap-2 bg-paper-dim">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="اكتب سؤالك..." disabled={sending} className="flex-1 bg-card" />
            <Button type="submit" disabled={sending || !input.trim()}><Send className="size-4" /></Button>
          </form>
        </div>
      </main>
    </div>
  );
}