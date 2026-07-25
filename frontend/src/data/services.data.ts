export interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  benefits: string[];
  startingPrice: number;
}

export const SERVICES: Service[] = [
  {
    id: "consultation",
    name: "Legal Consultation",
    icon: "MessagesSquare",
    description: "Speak with a verified advocate over video, voice, or chat to get clear guidance on your situation.",
    benefits: ["Response within 30 minutes", "Verified specialists only", "Follow-up notes included"],
    startingPrice: 700,
  },
  {
    id: "drafting",
    name: "Document Drafting",
    icon: "FileEdit",
    description: "Contracts, notices, and agreements drafted by lawyers who specialize in your exact use case.",
    benefits: ["Unlimited revisions", "Delivered within 48 hours", "Plain-language summary included"],
    startingPrice: 2500,
  },
  {
    id: "notice",
    name: "Legal Notice",
    icon: "FileWarning",
    description: "Send a formally drafted legal notice with delivery tracking and lawyer sign-off.",
    benefits: ["Court-ready formatting", "Tracked delivery", "Response drafting included"],
    startingPrice: 1500,
  },
  {
    id: "property-verification",
    name: "Property Verification",
    icon: "SearchCheck",
    description: "Full title-chain verification before you sign — catch encumbrances before they become disputes.",
    benefits: ["Title chain report", "Encumbrance check", "Site-visit option available"],
    startingPrice: 4000,
  },
  {
    id: "business-registration",
    name: "Business Registration",
    icon: "Building2",
    description: "Company, LLP, or partnership registration handled end to end, including compliance filings.",
    benefits: ["MCA filing included", "PAN & TAN assistance", "Post-registration compliance guide"],
    startingPrice: 6000,
  },
  {
    id: "trademark",
    name: "Trademark Filing",
    icon: "BadgeCheck",
    description: "Search, file, and defend your brand's trademark with dedicated opposition support.",
    benefits: ["Comprehensive search report", "Class selection guidance", "Opposition defense included"],
    startingPrice: 3500,
  },
  {
    id: "gst-filing",
    name: "GST Registration & Filing",
    icon: "Receipt",
    description: "Get GST-registered and stay compliant with monthly filing support from tax specialists.",
    benefits: ["Same-week registration", "Monthly filing reminders", "Notice response support"],
    startingPrice: 1800,
  },
  {
    id: "court-representation",
    name: "Court Representation",
    icon: "Landmark",
    description: "Full representation before district, high court, or tribunal by an advocate matched to your case.",
    benefits: ["Case strategy session", "Hearing-by-hearing updates", "Transparent fee structure"],
    startingPrice: 5000,
  },
];
