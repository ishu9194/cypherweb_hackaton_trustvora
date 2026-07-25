import { LegalDocumentLayout, type LegalSection } from "@/components/common/LegalDocumentLayout";

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    paragraphs: [
      "By accessing or using Trustix, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the platform.",
    ],
  },
  {
    id: "platform-role",
    title: "Our Role as a Platform",
    paragraphs: [
      "Trustix is a marketplace connecting clients with independent, licensed legal practitioners. We do not provide legal advice ourselves and are not a law firm.",
      "Lawyers listed on Trustix operate as independent professionals responsible for their own advice, conduct, and compliance with Bar Council regulations.",
    ],
  },
  {
    id: "accounts",
    title: "Accounts & Eligibility",
    paragraphs: [
      "You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your login credentials.",
      "Lawyer accounts require valid Bar Council enrollment details, which are verified before a profile is published.",
    ],
  },
  {
    id: "bookings-payments",
    title: "Bookings & Payments",
    paragraphs: [
      "Consultation fees are set by individual lawyers and displayed before booking. A platform fee may apply and is shown at checkout.",
      "Cancellations made more than 4 hours before a scheduled consultation are eligible for a full refund; later cancellations are non-refundable.",
    ],
  },
  {
    id: "conduct",
    title: "User Conduct",
    paragraphs: [
      "You agree not to misuse the platform, including submitting false information, harassing other users, or attempting to bypass booking and payment systems.",
      "Violations may result in suspension or termination of your account.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    paragraphs: [
      "Trustix is not liable for the outcome of legal advice or representation provided by lawyers on the platform. Our liability is limited to facilitating the connection and payment process.",
    ],
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    paragraphs: [
      "We may update these Terms from time to time. Continued use of the platform after changes constitutes acceptance of the revised Terms.",
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    paragraphs: [
      "Questions about these Terms can be directed to legal@trustix.in or through our Contact page.",
    ],
  },
];

export function TermsConditionsPage() {
  return <LegalDocumentLayout title="Terms & Conditions" updatedAt="July 1, 2026" sections={SECTIONS} />;
}
