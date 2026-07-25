export interface ChatMessage {
  id: string;
  senderId: "me" | string;
  text?: string;
  attachment?: { type: "image" | "document" | "voice"; name: string; duration?: string };
  timestamp: string;
  read: boolean;
  reactions?: string[];
}

export interface Conversation {
  id: string;
  lawyerId: string;
  lawyerName: string;
  lawyerAvatarUrl: string;
  online: boolean;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  messages: ChatMessage[];
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    lawyerId: "lw-001",
    lawyerName: "Adv. Priya Sharma",
    lawyerAvatarUrl: "https://i.pravatar.cc/80?img=47",
    online: true,
    lastMessage: "Sure, I'll have the draft ready by Thursday.",
    lastMessageAt: "2026-07-22T15:40:00",
    unread: 2,
    messages: [
      { id: "m1", senderId: "lw-001", text: "Hi Meet, I've reviewed the founders' agreement draft.", timestamp: "2026-07-22T15:10:00", read: true },
      { id: "m2", senderId: "me", text: "Great, any major changes needed?", timestamp: "2026-07-22T15:15:00", read: true },
      { id: "m3", senderId: "lw-001", text: "Mostly the vesting schedule — let's tighten the cliff to 12 months.", timestamp: "2026-07-22T15:20:00", read: true, reactions: ["👍"] },
      { id: "m4", senderId: "me", attachment: { type: "document", name: "Founders_Agreement_v2.pdf" }, timestamp: "2026-07-22T15:25:00", read: true },
      { id: "m5", senderId: "lw-001", text: "Got it, reviewing now.", timestamp: "2026-07-22T15:30:00", read: true },
      { id: "m6", senderId: "lw-001", text: "Sure, I'll have the draft ready by Thursday.", timestamp: "2026-07-22T15:40:00", read: false },
    ],
  },
  {
    id: "conv-2",
    lawyerId: "lw-005",
    lawyerName: "Adv. Kavita Desai",
    lawyerAvatarUrl: "https://i.pravatar.cc/80?img=45",
    online: false,
    lastMessage: "The GST notice response has been filed.",
    lastMessageAt: "2026-07-20T11:00:00",
    unread: 0,
    messages: [
      { id: "m1", senderId: "lw-005", text: "I've filed the response to the GST notice.", timestamp: "2026-07-20T10:55:00", read: true },
      { id: "m2", senderId: "lw-005", text: "The GST notice response has been filed.", timestamp: "2026-07-20T11:00:00", read: true },
      { id: "m3", senderId: "me", text: "Thank you! When should we expect a reply?", timestamp: "2026-07-20T11:05:00", read: true },
    ],
  },
  {
    id: "conv-3",
    lawyerId: "lw-003",
    lawyerName: "Adv. Ananya Iyer",
    lawyerAvatarUrl: "https://i.pravatar.cc/80?img=32",
    online: true,
    lastMessage: "Voice message",
    lastMessageAt: "2026-07-18T09:20:00",
    unread: 0,
    messages: [
      { id: "m1", senderId: "lw-003", attachment: { type: "voice", name: "Voice note", duration: "0:42" }, timestamp: "2026-07-18T09:20:00", read: true },
    ],
  },
];

export interface DashboardDocument {
  id: string;
  name: string;
  category: "Contracts" | "Court Filings" | "ID Proof" | "Correspondence";
  sizeLabel: string;
  uploadedAt: string;
  caseId?: string;
}

export const DASHBOARD_DOCUMENTS: DashboardDocument[] = [
  { id: "doc-1", name: "Founders_Agreement_v2.pdf", category: "Contracts", sizeLabel: "1.2 MB", uploadedAt: "2026-07-22T15:25:00", caseId: "cs-1" },
  { id: "doc-2", name: "GST_Notice_Response.pdf", category: "Court Filings", sizeLabel: "480 KB", uploadedAt: "2026-07-15T09:00:00", caseId: "cs-3" },
  { id: "doc-3", name: "Aadhaar_Card.pdf", category: "ID Proof", sizeLabel: "620 KB", uploadedAt: "2026-06-02T00:00:00" },
  { id: "doc-4", name: "Property_Title_Deed.pdf", category: "Contracts", sizeLabel: "2.1 MB", uploadedAt: "2026-06-01T00:00:00", caseId: "cs-2" },
  { id: "doc-5", name: "Lawyer_Correspondence_June.pdf", category: "Correspondence", sizeLabel: "310 KB", uploadedAt: "2026-06-28T00:00:00" },
];

export interface DashboardNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  category: "appointment" | "case" | "payment" | "message" | "system";
}

export const DASHBOARD_NOTIFICATIONS: DashboardNotification[] = [
  { id: "n1", title: "Upcoming consultation reminder", description: "Your video call with Adv. Priya Sharma starts in 2 hours.", timestamp: "2026-07-23T09:00:00", read: false, category: "appointment" },
  { id: "n2", title: "New message from Adv. Priya Sharma", description: "Sure, I'll have the draft ready by Thursday.", timestamp: "2026-07-22T15:40:00", read: false, category: "message" },
  { id: "n3", title: "Case status updated", description: "\"GST Notice Response\" moved to In Progress.", timestamp: "2026-07-21T12:00:00", read: true, category: "case" },
  { id: "n4", title: "Payment received", description: "Your payment of ₹1,500 was processed successfully.", timestamp: "2026-07-18T00:00:00", read: true, category: "payment" },
  { id: "n5", title: "Document uploaded", description: "Founders_Agreement_v2.pdf was added to your case.", timestamp: "2026-07-22T15:25:00", read: true, category: "system" },
  { id: "n6", title: "Consultation completed", description: "Your session with Adv. Ananya Iyer has ended.", timestamp: "2026-07-18T15:45:00", read: true, category: "appointment" },
];
