import type { ChatMessage } from "./dashboardExtras.data";

export interface ClientConversation {
  id: string;
  clientName: string;
  clientAvatarUrl: string;
  online: boolean;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  messages: ChatMessage[];
}

export const LAWYER_CONVERSATIONS: ClientConversation[] = [
  {
    id: "lconv-1",
    clientName: "Meet Agrawal",
    clientAvatarUrl: "https://i.pravatar.cc/80?img=13",
    online: true,
    lastMessage: "Sounds good, see you Thursday!",
    lastMessageAt: "2026-07-22T15:40:00",
    unread: 1,
    messages: [
      { id: "m1", senderId: "client", text: "Hi, I reviewed the vesting schedule changes.", timestamp: "2026-07-22T15:10:00", read: true },
      { id: "m2", senderId: "me", text: "Great — any concerns before I finalize the draft?", timestamp: "2026-07-22T15:15:00", read: true },
      { id: "m3", senderId: "client", text: "None, looks good to me.", timestamp: "2026-07-22T15:20:00", read: true, reactions: ["👍"] },
      { id: "m4", senderId: "me", text: "I'll have the final version ready by Thursday.", timestamp: "2026-07-22T15:35:00", read: true },
      { id: "m5", senderId: "client", text: "Sounds good, see you Thursday!", timestamp: "2026-07-22T15:40:00", read: false },
    ],
  },
  {
    id: "lconv-2",
    clientName: "Farhan Ali",
    clientAvatarUrl: "https://i.pravatar.cc/80?img=33",
    online: false,
    lastMessage: "Thank you for filing the response!",
    lastMessageAt: "2026-07-20T11:05:00",
    unread: 0,
    messages: [
      { id: "m1", senderId: "me", text: "I've filed the response to the GST notice.", timestamp: "2026-07-20T10:55:00", read: true },
      { id: "m2", senderId: "client", text: "Thank you for filing the response!", timestamp: "2026-07-20T11:05:00", read: true },
    ],
  },
  {
    id: "lconv-3",
    clientName: "Neha Kulkarni",
    clientAvatarUrl: "https://i.pravatar.cc/80?img=48",
    online: true,
    lastMessage: "Voice message",
    lastMessageAt: "2026-07-18T09:20:00",
    unread: 2,
    messages: [
      { id: "m1", senderId: "client", attachment: { type: "voice", name: "Voice note", duration: "0:35" }, timestamp: "2026-07-18T09:20:00", read: false },
    ],
  },
];
