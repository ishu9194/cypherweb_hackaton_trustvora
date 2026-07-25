import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, CheckCheck, Mic, Paperclip, Image as ImageIcon, Send, Smile, FileText } from "lucide-react";
import { LAWYER_CONVERSATIONS } from "@/data/lawyerConversations.data";
import type { ChatMessage } from "@/data/dashboardExtras.data";
import { Avatar } from "@/components/ui/avatar";
import { SearchBox } from "@/components/ui/search-box";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { formatTime, cn } from "@/lib/utils";

const EMOJIS = ["👍", "❤️", "😂", "🙏", "🎉", "👏", "😊", "🔥"];

export function LawyerMessagesPage() {
  const [conversations, setConversations] = useState(LAWYER_CONVERSATIONS);
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];
  const filtered = conversations.filter((c) => c.clientName.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, isTyping]);

  const sendMessage = () => {
    if (!draft.trim() || !active) return;
    const message: ChatMessage = { id: `m-${Date.now()}`, senderId: "me", text: draft, timestamp: new Date().toISOString(), read: false };
    setConversations((prev) => prev.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, message], lastMessage: draft, lastMessageAt: message.timestamp } : c)));
    setDraft("");
    setShowEmoji(false);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply: ChatMessage = { id: `m-${Date.now() + 1}`, senderId: "client", text: "Got it, thank you!", timestamp: new Date().toISOString(), read: true };
      setConversations((prev) => prev.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, reply], lastMessage: reply.text!, lastMessageAt: reply.timestamp } : c)));
    }, 1800);
  };

  const addReaction = (messageId: string, emoji: string) => {
    if (!active) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === active.id ? { ...c, messages: c.messages.map((m) => (m.id === messageId ? { ...m, reactions: [...(m.reactions ?? []), emoji] } : m)) } : c)),
    );
  };

  const attach = (type: "image" | "document" | "voice") => {
    if (!active) return;
    const names = { image: "Photo.jpg", document: "Document.pdf", voice: "Voice note" };
    const message: ChatMessage = { id: `m-${Date.now()}`, senderId: "me", attachment: { type, name: names[type], duration: type === "voice" ? "0:14" : undefined }, timestamp: new Date().toISOString(), read: false };
    setConversations((prev) => prev.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, message] } : c)));
    toast.success(`${type === "voice" ? "Voice message" : "File"} sent`);
  };

  if (!active) return null;

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex w-full max-w-xs shrink-0 flex-col border-r border-border">
        <div className="border-b border-border p-4">
          <h2 className="font-display text-base font-semibold text-foreground">Messages</h2>
          <SearchBox placeholder="Search clients…" onSearch={setQuery} className="mt-3" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => setActiveId(conv.id)}
              className={cn("flex w-full items-center gap-3 border-b border-border p-4 text-left transition-colors hover:bg-surface-sunken", conv.id === activeId && "bg-surface-sunken")}
            >
              <Avatar src={conv.clientAvatarUrl} name={conv.clientName} size="md" online={conv.online} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-foreground">{conv.clientName}</p>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{formatTime(conv.lastMessageAt)}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[10px] font-semibold text-white">{conv.unread}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <Avatar src={active.clientAvatarUrl} name={active.clientName} size="sm" online={active.online} />
          <div>
            <p className="text-sm font-semibold text-foreground">{active.clientName}</p>
            <p className="text-xs text-muted-foreground">{active.online ? "Online" : "Offline"}</p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          {active.messages.map((message) => {
            const isMe = message.senderId === "me";
            return (
              <div key={message.id} className={cn("group flex", isMe ? "justify-end" : "justify-start")}>
                <div className="max-w-xs">
                  <div className={cn("rounded-2xl px-4 py-2.5 text-sm", isMe ? "bg-brand-600 text-white" : "bg-surface-sunken text-foreground")}>
                    {message.text && <p>{message.text}</p>}
                    {message.attachment?.type === "document" && <div className="flex items-center gap-2"><FileText className="h-4 w-4" /> {message.attachment.name}</div>}
                    {message.attachment?.type === "image" && <div className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> {message.attachment.name}</div>}
                    {message.attachment?.type === "voice" && <div className="flex items-center gap-2"><Mic className="h-4 w-4" /> Voice message · {message.attachment.duration}</div>}
                  </div>
                  <div className={cn("mt-1 flex items-center gap-1 text-[10px] text-muted-foreground", isMe ? "justify-end" : "justify-start")}>
                    {formatTime(message.timestamp)}
                    {isMe && (message.read ? <CheckCheck className="h-3 w-3 text-brand-600" /> : <Check className="h-3 w-3" />)}
                  </div>
                  {message.reactions && message.reactions.length > 0 && (
                    <div className={cn("mt-1 flex gap-0.5", isMe ? "justify-end" : "justify-start")}>{message.reactions.map((r, i) => <span key={i} className="text-xs">{r}</span>)}</div>
                  )}
                  <div className={cn("mt-1 hidden gap-1 group-hover:flex", isMe ? "justify-end" : "justify-start")}>
                    {["👍", "❤️"].map((emoji) => <button key={emoji} type="button" onClick={() => addReaction(message.id, emoji)} className="text-xs opacity-60 hover:opacity-100">{emoji}</button>)}
                  </div>
                </div>
              </div>
            );
          })}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl bg-surface-sunken px-4 py-3">
                {[0, 1, 2].map((i) => <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />)}
              </div>
            </motion.div>
          )}
        </div>

        <div className="border-t border-border p-4">
          {showEmoji && (
            <div className="mb-2 flex flex-wrap gap-1.5 rounded-lg border border-border bg-surface p-2">
              {EMOJIS.map((emoji) => <button key={emoji} type="button" onClick={() => setDraft((d) => d + emoji)} className="rounded p-1 text-lg hover:bg-surface-sunken">{emoji}</button>)}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Button size="icon" variant="ghost" aria-label="Attach image" onClick={() => attach("image")}><ImageIcon className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" aria-label="Attach document" onClick={() => attach("document")}><Paperclip className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" aria-label="Voice message" onClick={() => attach("voice")}><Mic className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" aria-label="Emoji" onClick={() => setShowEmoji((s) => !s)}><Smile className="h-4 w-4" /></Button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message…"
              className="h-10 flex-1 rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <Button size="icon" aria-label="Send" onClick={sendMessage}><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
