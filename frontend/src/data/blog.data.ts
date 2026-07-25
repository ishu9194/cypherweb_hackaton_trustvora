export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorAvatarUrl: string;
  date: string;
  readTimeMinutes: number;
  coverGradient: string;
  featured?: boolean;
}

export const BLOG_CATEGORIES = ["All", "Startup Law", "Real Estate", "Taxation", "Family Law", "Employment", "Cyber Crime"] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "b1",
    title: "5 Clauses Every Founders' Agreement Needs in 2026",
    excerpt: "Vesting schedules and IP assignment are non-negotiable — here's what else your co-founder agreement is probably missing.",
    category: "Startup Law",
    author: "Adv. Priya Sharma",
    authorAvatarUrl: "https://i.pravatar.cc/80?img=47",
    date: "2026-07-14T00:00:00",
    readTimeMinutes: 6,
    coverGradient: "from-brand-600 to-brand-800",
    featured: true,
  },
  {
    id: "b2",
    title: "RERA Compliance Checklist Before You Book a Flat",
    excerpt: "A property lawyer's step-by-step list for verifying a project's RERA registration before you pay a rupee.",
    category: "Real Estate",
    author: "Adv. Vikram Nair",
    authorAvatarUrl: "https://i.pravatar.cc/80?img=51",
    date: "2026-07-08T00:00:00",
    readTimeMinutes: 8,
    coverGradient: "from-accent-500 to-accent-700",
  },
  {
    id: "b3",
    title: "How GST Notices Actually Get Escalated (and How to Respond)",
    excerpt: "Understanding the difference between a scrutiny notice and a show-cause notice can save your business months.",
    category: "Taxation",
    author: "Adv. Kavita Desai",
    authorAvatarUrl: "https://i.pravatar.cc/80?img=45",
    date: "2026-06-29T00:00:00",
    readTimeMinutes: 5,
    coverGradient: "from-navy-700 to-navy-900",
  },
  {
    id: "b4",
    title: "Mutual Consent Divorce: What the Six-Month Cooling Period Really Means",
    excerpt: "Courts can waive the waiting period in specific circumstances — here's when that actually applies.",
    category: "Family Law",
    author: "Adv. Ananya Iyer",
    authorAvatarUrl: "https://i.pravatar.cc/80?img=32",
    date: "2026-06-20T00:00:00",
    readTimeMinutes: 7,
    coverGradient: "from-rose-500 to-rose-700",
  },
  {
    id: "b5",
    title: "Wrongful Termination in India: What Employees Can Actually Claim",
    excerpt: "Notice pay, severance, and reinstatement — a breakdown of what the law entitles you to and what it doesn't.",
    category: "Employment",
    author: "Adv. Simran Kaur",
    authorAvatarUrl: "https://i.pravatar.cc/80?img=44",
    date: "2026-06-11T00:00:00",
    readTimeMinutes: 6,
    coverGradient: "from-amber-500 to-amber-700",
  },
  {
    id: "b6",
    title: "UPI Fraud: The First Three Things to Do in the Next 24 Hours",
    excerpt: "Banking timelines matter more than most victims realize — here's the exact sequence that maximizes recovery odds.",
    category: "Cyber Crime",
    author: "Adv. Rohan Mehta",
    authorAvatarUrl: "https://i.pravatar.cc/80?img=12",
    date: "2026-05-30T00:00:00",
    readTimeMinutes: 4,
    coverGradient: "from-red-600 to-red-800",
  },
  {
    id: "b7",
    title: "SAFE Notes vs. Convertible Notes: A Founder's Plain-English Guide",
    excerpt: "Both delay a valuation conversation — but they don't delay it in the same way, or with the same risks.",
    category: "Startup Law",
    author: "Adv. Priya Sharma",
    authorAvatarUrl: "https://i.pravatar.cc/80?img=47",
    date: "2026-05-22T00:00:00",
    readTimeMinutes: 9,
    coverGradient: "from-brand-500 to-accent-600",
  },
  {
    id: "b8",
    title: "Buying Resale Property? Here's the Document Chain to Demand",
    excerpt: "Missing even one link in the title chain can leave you without recourse years later.",
    category: "Real Estate",
    author: "Adv. Vikram Nair",
    authorAvatarUrl: "https://i.pravatar.cc/80?img=51",
    date: "2026-05-10T00:00:00",
    readTimeMinutes: 6,
    coverGradient: "from-teal-500 to-teal-700",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  { question: "How does Trustix verify its lawyers?", answer: "Every advocate submits their Bar Council enrollment number, practicing certificate, and court affiliation, which our team manually verifies before a profile goes live. Verified profiles carry a blue badge." },
  { question: "How quickly can I speak with a lawyer?", answer: "Most consultations are booked and confirmed within 30 minutes. Many advocates also offer instant chat, so you can start describing your situation right away." },
  { question: "What does a consultation cost?", answer: "Consultation fees are set individually by each advocate and shown upfront before you book, starting from ₹700. There are no hidden platform fees." },
  { question: "Can I get a refund if I cancel?", answer: "Yes. Cancellations made more than 4 hours before your scheduled consultation are refunded in full to your original payment method within 5-7 business days." },
  { question: "Is my information kept confidential?", answer: "All communications and uploaded documents are encrypted end-to-end and only visible to you and the advocate you're working with." },
  { question: "Do you offer services outside major cities?", answer: "Yes — video and chat consultations mean location isn't a barrier. Many of our advocates also travel for in-person representation in nearby districts." },
];
