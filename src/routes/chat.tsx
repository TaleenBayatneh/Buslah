import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "الشات الإرشادي — موجِّه" }] }),
  component: ChatPage,
});

interface Msg { id: string; role: "user" | "assistant"; content: string; }

// TODO: استبدل هذا بـ webhook URL تبعك من n8n
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;

function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([
    { id: "init", role: "assistant", content: "أهلاً بك في موجِّه! 🎓 أنا مرشدك الذكي. خبّرني عن نفسك: شو فرعك في التوجيهي ومعدلك؟" },
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
      if (!N8N_WEBHOOK_URL) {
        const fallback = "⚠️ لم يتم ربط الشات بـ n8n بعد. أضف عنوان الـ webhook في إعدادات المشروع لتفعيل الردود الذكية.";
        setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: fallback }]);
        return;
      }
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, userId: user?.id ?? "guest", conversationId: convId }),
      });
      const data = await res.json().catch(() => ({}));
      const reply = (data.reply || data.output || data.message || "تم استلام رسالتك.") as string;
      const botMsg: Msg = { id: crypto.randomUUID(), role: "assistant", content: reply };
      setMessages((m) => [...m, botMsg]);
      persist("assistant", reply);
    } catch (err) {
      toast.error("تعذّر الاتصال بالمساعد. حاول مرة أخرى.");
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
            <div className="size-2.5 bg-emerald-600 rounded-full" />
            <span className="font-display text-lg font-bold text-academic">المرشد الأكاديمي الذكي</span>
            {!user && <span className="mr-auto text-xs text-muted-foreground">جلسة ضيف</span>}
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 min-h-[60vh]">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`size-9 rounded-sm flex items-center justify-center shrink-0 ${m.role === "assistant" ? "bg-academic" : "bg-paper-dim border border-border"}`}>
                  {m.role === "assistant"
                    ? <span className="font-display text-primary-foreground text-lg font-bold leading-none -mt-1">م</span>
                    : <span className="text-sm font-bold">أ</span>}
                </div>
                <div className={`p-3 rounded-sm text-sm leading-relaxed max-w-[80%] whitespace-pre-wrap ${m.role === "assistant" ? "bg-paper-dim border border-border" : "bg-academic/5 border border-academic/15"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex gap-3"><div className="size-9 rounded-sm bg-academic flex items-center justify-center"><Loader2 className="size-4 text-primary-foreground animate-spin" /></div><div className="p-3 bg-paper-dim border border-border rounded-sm text-sm">يكتب...</div></div>
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