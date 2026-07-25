import type { LawyerProfileExtras } from "@/types";

export const LAWYER_PROFILE_EXTRAS: Record<string, LawyerProfileExtras> = {
  "lw-001": {
    lawyerId: "lw-001",
    education: [
      { degree: "LLM, Corporate Law", institution: "Harvard Law School", year: 2015 },
      { degree: "LLB", institution: "Government Law College, Mumbai", year: 2012 },
    ],
    certifications: [
      { name: "Certified Mergers & Acquisitions Advisor", issuer: "IACVA", year: 2019 },
      { name: "Startup Governance Specialist", issuer: "IndiaLaw Institute", year: 2021 },
    ],
    courtMemberships: [
      { name: "Bar Council of Maharashtra & Goa", since: 2012 },
      { name: "Bombay High Court Bar Association", since: 2013 },
    ],
    awards: [
      { title: "Rising Star — Corporate Law", issuer: "Legal Era Awards", year: 2022 },
      { title: "Top 40 Under 40 Lawyers", issuer: "India Business Law Journal", year: 2023 },
    ],
    officeLocations: [
      { label: "Head Office", address: "14th Floor, Prestige Tower, Bandra Kurla Complex", city: "Mumbai" },
      { label: "Satellite Office", address: "3rd Floor, Koregaon Business Park", city: "Pune" },
    ],
    timeline: [
      { year: "2012", title: "Enrolled with Bar Council of Maharashtra", description: "Began practice in commercial litigation at a Mumbai chambers." },
      { year: "2015", title: "LLM from Harvard Law School", description: "Specialized in corporate governance and M&A structuring." },
      { year: "2018", title: "Founded independent corporate practice", description: "Started advising early-stage startups on incorporation and fundraising." },
      { year: "2023", title: "Crossed 300 successful engagements", description: "Recognized as a go-to counsel for Series A/B startup rounds." },
    ],
    galleryLabels: ["Office reception", "Conference room", "Client meeting", "Team offsite"],
    faqs: [
      { question: "Do you work with pre-revenue startups?", answer: "Yes — a large share of my practice is founders at the incorporation or pre-seed stage." },
      { question: "Can you review an existing SAFE or convertible note?", answer: "Absolutely, this is one of the most common consultations I take." },
    ],
  },
  "lw-002": {
    lawyerId: "lw-002",
    education: [
      { degree: "LLB", institution: "Government Law College, Delhi", year: 2016 },
    ],
    certifications: [
      { name: "Certified Cyber Law Practitioner", issuer: "Data Security Council of India", year: 2020 },
    ],
    courtMemberships: [
      { name: "Bar Council of Delhi", since: 2016 },
      { name: "Delhi High Court Bar Association", since: 2017 },
    ],
    awards: [
      { title: "Cyber Law Advocate of the Year", issuer: "Digital India Legal Forum", year: 2023 },
    ],
    officeLocations: [
      { label: "Head Office", address: "6th Floor, DLF Cyber City, Sector 24", city: "Gurugram" },
    ],
    timeline: [
      { year: "2016", title: "Enrolled with Bar Council of Delhi", description: "Started in criminal defense at Tis Hazari Courts." },
      { year: "2019", title: "Shifted focus to cyber crime", description: "Began handling fraud, hacking, and data theft cases." },
      { year: "2023", title: "200th case milestone", description: "Reached 200 criminal and cyber-fraud cases represented." },
    ],
    galleryLabels: ["Chambers", "Court appearance prep", "Client consultation room"],
    faqs: [
      { question: "Do you handle online fraud complaints?", answer: "Yes, including bank fraud, UPI scams, and identity theft cases." },
      { question: "Can you help file a cyber crime FIR?", answer: "I can guide you through the filing process and represent you through resolution." },
    ],
  },
  "lw-003": {
    lawyerId: "lw-003",
    education: [
      { degree: "LLM, Family Law", institution: "National Law School of India University, Bangalore", year: 2011 },
      { degree: "LLB", institution: "Bangalore University", year: 2008 },
    ],
    certifications: [
      { name: "Certified Family Mediator", issuer: "Bangalore Mediation Centre", year: 2014 },
    ],
    courtMemberships: [
      { name: "Bar Council of Karnataka", since: 2008 },
      { name: "Karnataka High Court Bar Association", since: 2009 },
    ],
    awards: [
      { title: "Excellence in Family Mediation", issuer: "Karnataka State Legal Services Authority", year: 2021 },
      { title: "Women in Law Achievement Award", issuer: "Bar Council of India", year: 2024 },
    ],
    officeLocations: [
      { label: "Head Office", address: "5th Floor, UB City, Vittal Mallya Road", city: "Bengaluru" },
    ],
    timeline: [
      { year: "2008", title: "Enrolled with Bar Council of Karnataka", description: "Began practice in family and matrimonial law." },
      { year: "2014", title: "Certified in family mediation", description: "Adopted a mediation-first approach to divorce and custody cases." },
      { year: "2019", title: "Opened independent family law practice", description: "Built a team focused exclusively on family disputes." },
      { year: "2024", title: "400+ cases resolved", description: "Recognized as one of Bengaluru's leading family law advocates." },
    ],
    galleryLabels: ["Mediation room", "Office lobby", "Team photo", "Client lounge"],
    faqs: [
      { question: "Do you handle mutual consent divorce?", answer: "Yes, and I typically recommend it first where both parties are willing — it's faster and less adversarial." },
      { question: "Can you help with child custody disputes?", answer: "Custody and visitation arrangements are a core part of my practice." },
    ],
  },
  "lw-004": {
    lawyerId: "lw-004",
    education: [{ degree: "LLB", institution: "ILS Law College, Pune", year: 2019 }],
    certifications: [{ name: "RERA Compliance Specialist", issuer: "MahaRERA Training Institute", year: 2021 }],
    courtMemberships: [{ name: "Bar Council of Maharashtra & Goa", since: 2019 }],
    awards: [{ title: "Emerging Property Law Advocate", issuer: "Pune Bar Association", year: 2023 }],
    officeLocations: [{ label: "Head Office", address: "3rd Floor, Koregaon Business Park", city: "Pune" }],
    timeline: [
      { year: "2019", title: "Enrolled with Bar Council of Maharashtra", description: "Started in real estate and property litigation." },
      { year: "2021", title: "RERA compliance certification", description: "Began advising developers on regulatory compliance." },
      { year: "2024", title: "100+ title verifications completed", description: "Built a reputation for catching encumbrances before closing." },
    ],
    galleryLabels: ["Office", "Site visit", "Client meeting"],
    faqs: [
      { question: "Do you conduct site visits before verification?", answer: "Yes, for an additional fee I offer an in-person site visit alongside the document review." },
      { question: "How long does title verification take?", answer: "Typically 5-7 business days depending on the property's document history." },
    ],
  },
  "lw-005": {
    lawyerId: "lw-005",
    education: [
      { degree: "LLM, Tax Law", institution: "University of Oxford", year: 2007 },
      { degree: "LLB", institution: "Government Law College, Mumbai", year: 2004 },
    ],
    certifications: [
      { name: "Chartered Tax Advisor", issuer: "Institute of Chartered Tax Advisors", year: 2010 },
    ],
    courtMemberships: [
      { name: "Bar Council of Maharashtra & Goa", since: 2004 },
      { name: "Supreme Court Bar Association", since: 2012 },
    ],
    awards: [
      { title: "Tax Litigator of the Year", issuer: "India Business Law Journal", year: 2020 },
      { title: "Lifetime Achievement — Taxation", issuer: "Legal Era Awards", year: 2024 },
    ],
    officeLocations: [
      { label: "Head Office", address: "14th Floor, Prestige Tower, Bandra Kurla Complex", city: "Mumbai" },
      { label: "Delhi Chambers", address: "2nd Floor, Supreme Court Legal Complex", city: "New Delhi" },
    ],
    timeline: [
      { year: "2004", title: "Enrolled with Bar Council of Maharashtra", description: "Began practice in tax and revenue law." },
      { year: "2007", title: "LLM from Oxford University", description: "Specialized in international and corporate taxation." },
      { year: "2012", title: "Enrolled with Supreme Court Bar", description: "Started appearing before the Supreme Court on appellate tax matters." },
      { year: "2024", title: "560+ cases won", description: "Recognized as one of India's foremost tax litigators." },
    ],
    galleryLabels: ["Chambers", "Supreme Court complex", "Team", "Conference"],
    faqs: [
      { question: "Do you handle GST notices for small businesses?", answer: "Yes, alongside larger enterprise tax litigation, I regularly assist SMEs with GST notices." },
      { question: "Can you represent me before the ITAT?", answer: "Yes, appellate tribunal representation is a core part of my practice." },
    ],
  },
  "lw-006": {
    lawyerId: "lw-006",
    education: [{ degree: "LLB", institution: "Symbiosis Law School, Pune", year: 2022 }],
    certifications: [{ name: "Consumer Rights Advocacy Program", issuer: "Consumer Guidance Society of India", year: 2023 }],
    courtMemberships: [{ name: "Bar Council of Maharashtra & Goa", since: 2022 }],
    awards: [],
    officeLocations: [{ label: "Head Office", address: "Sessions Court Complex, Shivajinagar", city: "Pune" }],
    timeline: [
      { year: "2022", title: "Enrolled with Bar Council of Maharashtra", description: "Began practice in consumer protection and employment law." },
      { year: "2024", title: "First 25 consumer cases won", description: "Built an affordable practice focused on individual clients and small businesses." },
    ],
    galleryLabels: ["Court complex", "Office desk"],
    faqs: [
      { question: "Do you offer flexible payment plans?", answer: "Yes, for straightforward consumer complaints I offer flat-fee and installment options." },
      { question: "Can you help with a wrongful termination claim?", answer: "Yes, employment disputes including wrongful termination are part of my practice." },
    ],
  },
};

/** Fallback extras for any lawyer not explicitly defined above, keyed generically. */
export function getLawyerExtras(lawyerId: string): LawyerProfileExtras {
  return (
    LAWYER_PROFILE_EXTRAS[lawyerId] ?? {
      lawyerId,
      education: [{ degree: "LLB", institution: "State Law College", year: 2016 }],
      certifications: [],
      courtMemberships: [{ name: "State Bar Council", since: 2016 }],
      awards: [],
      officeLocations: [{ label: "Head Office", address: "Legal Complex", city: "India" }],
      timeline: [{ year: "2016", title: "Enrolled with the Bar", description: "Began independent practice." }],
      galleryLabels: ["Office"],
      faqs: [],
    }
  );
}
