import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, CheckCheck, MessageSquare, Mic, Paperclip, Image as ImageIcon, Send, Smile, FileText } from "lucide-react";
import type { ChatMessage, Conversation } from "@/services/api/dashboard.service";
import { Avatar } from "@/components/ui/avatar";
import { SearchBox } from "@/components/ui/search-box";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/states/ErrorState";
import { toast } from "@/components/ui/toaster";
import { EmptyState } from "@/components/states/EmptyState";
import { ROUTES } from "@/constants/routes.constants";
import { formatTime, cn } from "@/lib/utils";
import { dashboardService } from "@/services/api/dashboard.service";
import { useAsync } from "@/hooks/useAsync";
import { emitTyping, getSocket, joinConversation, sendSocketMessage } from "@/services/socket.service";

const EMOJIS = ["👍", "❤️", "😂", "🙏", "🎉", "👏", "😊", "🔥"];

export function MessagesPage() {
  const [searchParams] = useSearchParams();
  const lawyerIdParam = searchParams.get("lawyerId");
  const lawyerNameParam = searchParams.get("lawyerName");

  const { data: initialConvs, isLoading, error, refetch } = useAsync(() => dashboardService.getMessages(), []);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialConvs) {
      let list = [...initialConvs];
      if (lawyerIdParam && !list.some((c) => c.lawyerId === lawyerIdParam || c.id === `conv-${lawyerIdParam}`)) {
        const targetName = lawyerNameParam || "Lawyer";
        const newConv: Conversation = {
          id: `conv-${lawyerIdParam}`,
          partnerName: targetName,
          partnerRole: "lawyer",
          lawyerId: lawyerIdParam,
          lawyerName: targetName,
          lastMessage: "Start a conversation",
          lastMessageAt: new Date().toISOString(),
          unreadCount: 0,
          online: true,
          messages: [],
        };
        list = [newConv, ...list];
      }
      setConversations(list);
      if (lawyerIdParam) {
        const target = list.find((c) => c.lawyerId === lawyerIdParam || c.id === `conv-${lawyerIdParam}`);
        if (target) setActiveId(target.id);
      } else if (!activeId && list.length > 0) {
        setActiveId(list[0].id);
      }
    }
  }, [initialConvs, lawyerIdParam, lawyerNameParam, activeId]);


  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];
  const filtered = conversations.filter((c) => (c.lawyerName ?? "").toLowerCase().includes(query.toLowerCase()));

  // Socket.io Real-Time Event Handlers
  useEffect(() => {
    if (!active?.id) return;

    joinConversation(active.id);
    const socket = getSocket();

    const handleReceiveMessage = (incoming: any) => {
      if (incoming.conversationId === active.id) {
        const newMsg: ChatMessage = {
          id: incoming.id || `m-${Date.now()}`,
          senderId: incoming.senderId,
          text: incoming.text || incoming.content || "",
          attachment: incoming.attachment,
          timestamp: incoming.timestamp || incoming.createdAt || new Date().toISOString(),
          read: incoming.read ?? false,
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === active.id) {
              const exists = c.messages.some(
                (m) =>
                  m.id === newMsg.id ||
                  (m.text === newMsg.text &&
                    Math.abs(new Date(m.timestamp).getTime() - new Date(newMsg.timestamp).getTime()) < 5000),
              );
              if (exists) return c;

              return {
                ...c,
                messages: [...c.messages, newMsg],
                lastMessage: newMsg.text || "",
                lastMessageAt: newMsg.timestamp,
              };
            }
            return c;
          }),
        );
      }
    };

    const handleUserTyping = (data: { conversationId: string; userId: string; isTyping: boolean }) => {
      if (data.conversationId === active.id) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("user_typing", handleUserTyping);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("user_typing", handleUserTyping);
    };
  }, [active?.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, isTyping]);

  const handleDraftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDraft(val);
    if (active?.id) {
      emitTyping(active.id, val.length > 0);
    }
  };

  const sendMessage = () => {
    if (!draft.trim() || !active) return;
    const sentText = draft;
    setDraft("");
    setShowEmoji(false);

    if (active.id) {
      emitTyping(active.id, false);
    }

    const message: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: "me",
      text: sentText,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? { ...c, messages: [...c.messages, message], lastMessage: sentText, lastMessageAt: message.timestamp }
          : c,
      ),
    );

    // Real-Time Socket dispatch & database persistence
    sendSocketMessage({
      conversationId: active.id,
      text: sentText,
      content: sentText,
      receiverId: active.lawyerId || active.id,
      senderName: "Client",
    });

    dashboardService.sendMessage(active.id, sentText).catch(() => {});
  };

  const addReaction = (messageId: string, emoji: string) => {
    if (!active) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? { ...c, messages: c.messages.map((m) => (m.id === messageId ? { ...m, reactions: [...(m.reactions ?? []), emoji] } : m)) }
          : c,
      ),
    );
  };

  const attach = async (type: "image" | "document" | "voice") => {
    if (!active) return;

    if (type === "voice") {
      const attachmentObj = { type, name: "Voice note", url: "#", duration: "0:12" };
      const message: ChatMessage = {
        id: `m-${Date.now()}`,
        senderId: "me",
        text: "Voice note",
        attachment: attachmentObj,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setConversations((prev) => prev.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, message] } : c)));
      sendSocketMessage({
        conversationId: active.id,
        text: "Voice note",
        content: "Voice note",
        receiverId: active.lawyerId || active.id,
        senderName: "Client",
        attachment: attachmentObj,
      });
      toast.success("Voice message sent");
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : ".pdf,.doc,.docx,.txt";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        toast.loading(`Uploading ${file.name} to Supabase...`);
        const { uploadToSupabase, BUCKETS } = await import("@/lib/supabase");
        const fileUrl = await uploadToSupabase(file, BUCKETS.CHAT, "attachments");
        toast.dismiss();

        const attachmentObj = { type, name: file.name, url: fileUrl };
        const message: ChatMessage = {
          id: `m-${Date.now()}`,
          senderId: "me",
          text: file.name,
          attachment: attachmentObj,
          timestamp: new Date().toISOString(),
          read: false,
        };

        setConversations((prev) => prev.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, message] } : c)));

        sendSocketMessage({
          conversationId: active.id,
          text: file.name,
          content: file.name,
          receiverId: active.lawyerId || active.id,
          senderName: "Client",
          attachment: attachmentObj,
        });

        toast.success(`Sent ${file.name}`);
      } catch (err: any) {
        toast.dismiss();
        toast.error(err.message || "Failed to upload file");
      }
    };

    input.click();
  };

  if (error) return <ErrorState description={error} onRetry={refetch} />;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center rounded-2xl border border-border bg-surface text-sm text-muted-foreground">
        Loading messages…
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center rounded-2xl border border-border bg-surface">
        <EmptyState
          icon={<MessageSquare className="h-5 w-5" />}
          title="No messages in inbox"
          description="Start a conversation from any lawyer's profile to see it here."
          action={<Button size="sm" asChild><Link to={ROUTES.findLawyers}>Browse lawyers</Link></Button>}
        />
      </div>
    );
  }

  if (!active) return null;

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 overflow-hidden rounded-2xl border border-border bg-surface">
      {/* Conversation list */}
      <div className="flex w-full max-w-xs shrink-0 flex-col border-r border-border">
        <div className="border-b border-border p-4">
          <h2 className="font-display text-base font-semibold text-foreground">Messages</h2>
          <SearchBox placeholder="Search conversations…" onSearch={setQuery} className="mt-3" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="p-4 text-center text-sm text-muted-foreground">No conversations match “{query}”.</p>
          )}
          {filtered.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => setActiveId(conv.id)}
              className={cn("flex w-full items-center gap-3 border-b border-border p-4 text-left transition-colors hover:bg-surface-sunken", conv.id === active.id && "bg-surface-sunken")}
            >
              <Avatar src={conv.lawyerAvatarUrl ?? conv.partnerAvatarUrl} name={conv.lawyerName ?? conv.partnerName ?? ""} size="md" online={conv.online} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-foreground">{conv.lawyerName ?? conv.partnerName ?? ""}</p>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{formatTime(conv.lastMessageAt ?? conv.lastMessageTime ?? "")}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{conv.lastMessage}</p>
              </div>
              {(conv.unreadCount ?? conv.unread ?? 0) > 0 && <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[10px] font-semibold text-white">{conv.unreadCount ?? conv.unread}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <Avatar src={active.lawyerAvatarUrl ?? active.partnerAvatarUrl} name={active.lawyerName ?? active.partnerName ?? ""} size="sm" online={active.online} />
          <div>
            <p className="text-sm font-semibold text-foreground">{active.lawyerName ?? active.partnerName ?? ""}</p>
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
                    {message.attachment?.type === "document" && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" /> {message.attachment.name}
                      </div>
                    )}
                    {message.attachment?.type === "image" && (
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" /> {message.attachment.name}
                      </div>
                    )}
                    {message.attachment?.type === "voice" && (
                      <div className="flex items-center gap-2">
                        <Mic className="h-4 w-4" /> Voice message · {message.attachment.duration}
                      </div>
                    )}
                  </div>
                  <div className={cn("mt-1 flex items-center gap-1 text-[10px] text-muted-foreground", isMe ? "justify-end" : "justify-start")}>
                    {formatTime(message.timestamp)}
                    {isMe && (message.read ? <CheckCheck className="h-3 w-3 text-brand-600" /> : <Check className="h-3 w-3" />)}
                  </div>
                  {message.reactions && message.reactions.length > 0 && (
                    <div className={cn("mt-1 flex gap-0.5", isMe ? "justify-end" : "justify-start")}>
                      {message.reactions.map((r, i) => <span key={i} className="text-xs">{r}</span>)}
                    </div>
                  )}
                  <div className={cn("mt-1 hidden gap-1 group-hover:flex", isMe ? "justify-end" : "justify-start")}>
                    {["👍", "❤️"].map((emoji) => (
                      <button key={emoji} type="button" onClick={() => addReaction(message.id, emoji)} className="text-xs opacity-60 hover:opacity-100">{emoji}</button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl bg-surface-sunken px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="border-t border-border p-4">
          {showEmoji && (
            <div className="mb-2 flex flex-wrap gap-1.5 rounded-lg border border-border bg-surface p-2">
              {EMOJIS.map((emoji) => (
                <button key={emoji} type="button" onClick={() => setDraft((d) => d + emoji)} className="rounded p-1 text-lg hover:bg-surface-sunken">{emoji}</button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Button size="icon" variant="ghost" aria-label="Attach image" onClick={() => attach("image")}><ImageIcon className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" aria-label="Attach document" onClick={() => attach("document")}><Paperclip className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" aria-label="Voice message" onClick={() => attach("voice")}><Mic className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" aria-label="Emoji" onClick={() => setShowEmoji((s) => !s)}><Smile className="h-4 w-4" /></Button>
            <input
              value={draft}
              onChange={handleDraftChange}
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

export default MessagesPage;
