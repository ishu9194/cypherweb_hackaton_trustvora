export interface TeamMember {
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { name: "Ritika Chawla", role: "Co-founder & CEO", avatarUrl: "https://i.pravatar.cc/200?img=48", bio: "Ex-legal ops lead at a fintech unicorn, obsessed with making legal help feel less intimidating." },
  { name: "Arnav Bose", role: "Co-founder & CTO", avatarUrl: "https://i.pravatar.cc/200?img=11", bio: "Built marketplace infrastructure at scale before turning to legal-tech full time." },
  { name: "Adv. Priya Sharma", role: "Head of Legal Partnerships", avatarUrl: "https://i.pravatar.cc/200?img=47", bio: "Leads lawyer onboarding and verification standards across all 20 practice areas." },
  { name: "Devika Menon", role: "Head of Design", avatarUrl: "https://i.pravatar.cc/200?img=26", bio: "Previously designed trust & safety products; champions clarity over cleverness." },
  { name: "Karan Vora", role: "Head of Growth", avatarUrl: "https://i.pravatar.cc/200?img=15", bio: "Scaled two consumer marketplaces from zero to seven-figure monthly bookings." },
  { name: "Ayesha Khan", role: "Head of Trust & Safety", avatarUrl: "https://i.pravatar.cc/200?img=31", bio: "Runs the verification and dispute-resolution processes that keep the platform honest." },
];

export interface CompanyMilestone {
  year: string;
  title: string;
  description: string;
}

export const COMPANY_TIMELINE: CompanyMilestone[] = [
  { year: "2022", title: "Trustora founded", description: "Started in a Bandra co-working space with 12 verified lawyers and a shared spreadsheet." },
  { year: "2023", title: "1,000 verified lawyers", description: "Crossed our first major verification milestone and launched video consultations." },
  { year: "2024", title: "Seed funding raised", description: "Raised ₹18 crore to expand practice-area coverage and build the client dashboard." },
  { year: "2025", title: "100,000+ lawyers onboarded", description: "Expanded to 200+ cities across India with dedicated regional support teams." },
  { year: "2026", title: "1 million clients served", description: "Crossed one million consultations booked, with a 99% platform satisfaction rate." },
];

export const COMPANY_VALUES = [
  { title: "Radical clarity", description: "Fees, timelines, and outcomes are shown upfront — no fine print, no surprises." },
  { title: "Verified, always", description: "Every lawyer is manually checked against Bar Council records before going live." },
  { title: "Built for trust", description: "Encrypted documents, transparent reviews, and a dedicated trust & safety team." },
];
