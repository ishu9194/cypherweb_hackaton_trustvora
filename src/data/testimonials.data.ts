import type { Appointment, LegalCase, Payment, Review } from "@/types";

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Sanjay Malhotra",
    role: "Founder, Kite Robotics",
    avatarUrl: "https://i.pravatar.cc/120?img=68",
    rating: 5,
    verifiedClient: true,
    quote:
      "We closed our seed round with Priya's contracts in place within a week. Clear communication throughout, no surprises at signing.",
  },
  {
    id: "t2",
    name: "Neha Kulkarni",
    role: "Homeowner, Pune",
    avatarUrl: "https://i.pravatar.cc/120?img=48",
    rating: 5,
    verifiedClient: true,
    quote:
      "Vikram caught a title defect our bank had missed. That single review probably saved us from a very expensive mistake.",
  },
  {
    id: "t3",
    name: "Farhan Ali",
    role: "Small Business Owner",
    avatarUrl: "https://i.pravatar.cc/120?img=33",
    rating: 4,
    verifiedClient: true,
    quote:
      "Booking a consultation took two minutes and I was talking to an advocate the same evening. Refreshingly simple.",
  },
  {
    id: "t4",
    name: "Meera Pillai",
    role: "HR Lead, Fintech Startup",
    avatarUrl: "https://i.pravatar.cc/120?img=25",
    rating: 5,
    verifiedClient: true,
    quote:
      "We use Trustora for every employment contract review now. Response times are consistently under 30 minutes.",
  },
];

export const APPOINTMENTS: Appointment[] = [
  { id: "ap-1", lawyerId: "lw-001", lawyerName: "Adv. Priya Sharma", lawyerAvatarUrl: "https://i.pravatar.cc/80?img=47", clientName: "Meet Agrawal", date: "2026-07-25T11:00:00", type: "video", status: "upcoming", fee: 1500 },
  { id: "ap-2", lawyerId: "lw-003", lawyerName: "Adv. Ananya Iyer", lawyerAvatarUrl: "https://i.pravatar.cc/80?img=32", clientName: "Meet Agrawal", date: "2026-07-18T15:30:00", type: "chat", status: "completed", fee: 1800 },
  { id: "ap-3", lawyerId: "lw-005", lawyerName: "Adv. Kavita Desai", lawyerAvatarUrl: "https://i.pravatar.cc/80?img=45", clientName: "Meet Agrawal", date: "2026-07-10T10:00:00", type: "office", status: "completed", fee: 2500 },
  { id: "ap-4", lawyerId: "lw-002", lawyerName: "Adv. Rohan Mehta", lawyerAvatarUrl: "https://i.pravatar.cc/80?img=12", clientName: "Meet Agrawal", date: "2026-06-30T09:00:00", type: "voice", status: "cancelled", fee: 1200 },
];

export const CASES: LegalCase[] = [
  { id: "cs-1", title: "Founders' Agreement Drafting", practiceArea: "Startup Law", status: "in-progress", progress: 65, lawyerName: "Adv. Priya Sharma", updatedAt: "2026-07-19T00:00:00" },
  { id: "cs-2", title: "Flat Purchase Title Verification", practiceArea: "Property Law", status: "closed", progress: 100, lawyerName: "Adv. Vikram Nair", updatedAt: "2026-06-02T00:00:00" },
  { id: "cs-3", title: "GST Notice Response", practiceArea: "Taxation", status: "open", progress: 20, lawyerName: "Adv. Kavita Desai", updatedAt: "2026-07-15T00:00:00" },
];

export const PAYMENTS: Payment[] = [
  { id: "pay-1", description: "Consultation — Adv. Priya Sharma", amount: 1500, status: "paid", date: "2026-07-18T00:00:00", invoiceUrl: "#" },
  { id: "pay-2", description: "Consultation — Adv. Kavita Desai", amount: 2500, status: "paid", date: "2026-07-10T00:00:00", invoiceUrl: "#" },
  { id: "pay-3", description: "Document Drafting — Founders' Agreement", amount: 8000, status: "pending", date: "2026-07-20T00:00:00" },
  { id: "pay-4", description: "Consultation — Adv. Rohan Mehta", amount: 1200, status: "refunded", date: "2026-06-30T00:00:00" },
];

export const REVIEWS: Review[] = [
  { id: "rv-1", authorName: "Sanjay Malhotra", authorAvatarUrl: "https://i.pravatar.cc/80?img=68", rating: 5, comment: "Meticulous and fast — exactly what a startup needs from legal counsel.", date: "2026-07-01T00:00:00", verifiedClient: true },
  { id: "rv-2", authorName: "Neha Kulkarni", authorAvatarUrl: "https://i.pravatar.cc/80?img=48", rating: 5, comment: "Caught details others missed. Highly recommend for property matters.", date: "2026-06-20T00:00:00", verifiedClient: true },
  { id: "rv-3", authorName: "Farhan Ali", authorAvatarUrl: "https://i.pravatar.cc/80?img=33", rating: 4, comment: "Great communication, would book again.", date: "2026-06-05T00:00:00", verifiedClient: false },
];
