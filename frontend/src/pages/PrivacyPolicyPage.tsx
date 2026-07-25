import { LegalDocumentLayout, type LegalSection } from "@/components/common/LegalDocumentLayout";

const SECTIONS: LegalSection[] = [
  {
    id: "overview",
    title: "Overview",
    paragraphs: [
      "Trustix (\"we\", \"our\", \"us\") operates a platform connecting clients with independent legal practitioners. This Privacy Policy explains what information we collect, how we use it, and the choices you have.",
      "By using Trustix, you agree to the collection and use of information in accordance with this policy.",
    ],
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    paragraphs: [
      "Account information: name, email, phone number, and role (client or lawyer) when you register.",
      "Booking information: consultation details, uploaded documents, and payment records tied to your bookings.",
      "Usage data: pages visited, features used, and device/browser information collected automatically.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "How We Use Your Information",
    paragraphs: [
      "To connect you with lawyers, process bookings, and facilitate secure communication.",
      "To send appointment reminders, receipts, and platform updates you've opted into.",
      "To improve matching quality, detect fraud, and maintain platform trust and safety.",
    ],
  },
  {
    id: "document-security",
    title: "Document Security",
    paragraphs: [
      "Documents you upload are encrypted in transit and at rest, and are only accessible to you and the lawyer you're actively working with.",
      "You can delete uploaded documents at any time from your Documents dashboard.",
    ],
  },
  {
    id: "sharing",
    title: "Sharing of Information",
    paragraphs: [
      "We share booking details only with the lawyer you've chosen to consult, and never sell personal data to third parties.",
      "We may share aggregated, anonymized data for research or platform improvement purposes.",
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights",
    paragraphs: [
      "You can access, correct, or delete your personal information from your account settings at any time.",
      "You may request a full export of your data by contacting privacy@trustix.in.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    paragraphs: [
      "We use cookies to keep you logged in, remember preferences like theme, and understand aggregate usage patterns.",
      "You can control cookie preferences through your browser settings.",
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    paragraphs: [
      "Questions about this policy can be directed to privacy@trustix.in or through our Contact page.",
    ],
  },
];

export function PrivacyPolicyPage() {
  return <LegalDocumentLayout title="Privacy Policy" updatedAt="July 1, 2026" sections={SECTIONS} />;
}
