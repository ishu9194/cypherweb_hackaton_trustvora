export type UserRole = "client" | "lawyer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  city?: string;
  role: UserRole;
}

export type ConsultationType = "video" | "voice" | "office" | "chat";
export type AppointmentStatus = "upcoming" | "completed" | "cancelled" | "pending";

export type LawyerGender = "male" | "female" | "other";

// ─── Rich profile related entities (live from DB) ─────────────────────────────
export interface LawyerEducationDB {
  id: string;
  lawyerId: string;
  degree: string;
  institution: string;
  year: number;
  order: number;
}

export interface LawyerTimelineDB {
  id: string;
  lawyerId: string;
  year: string;
  title: string;
  description: string;
  order: number;
}

export interface LawyerCourtMembershipDB {
  id: string;
  lawyerId: string;
  courtName: string;
  since: number;
  order: number;
}

export interface LawyerFAQDB {
  id: string;
  lawyerId: string;
  question: string;
  answer: string;
  order: number;
}

export interface LawyerOfficeDB {
  id: string;
  lawyerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  mapsLink?: string;
  order: number;
}

export interface LawyerGalleryImageDB {
  id: string;
  lawyerId: string;
  url: string;
  caption?: string;
  type: "photo" | "certificate" | "office";
  order: number;
}

export interface Lawyer {
  id: string;
  name: string;
  avatarUrl: string;
  verified: boolean;
  online: boolean;
  gender: LawyerGender;
  experienceYears: number;
  qualification: string;
  court: string;
  languages: string[];
  specializations: string[];
  rating: number;
  reviewCount: number;
  consultationFee: number;
  consultationTypes: ConsultationType[];
  responseTimeMinutes: number;
  city: string;
  state: string;
  bio: string;
  casesWon: number;
  successRate: number;
  joinedAt: string; // ISO

  // Extended profile fields (optional — may be null for older/seed lawyers)
  title?: string | null;
  subtitle?: string | null;
  barNumber?: string | null;
  barCouncilName?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  linkedin?: string | null;
  onlineConsultation?: boolean;
  offlineConsultation?: boolean;
  workingDays?: string | null;
  workingHours?: string | null;

  // Rich profile relations (populated on the public profile page)
  reviews?: Review[];
  education?: LawyerEducationDB[];
  timeline?: LawyerTimelineDB[];
  courtMemberships?: LawyerCourtMembershipDB[];
  faqs?: LawyerFAQDB[];
  officeLocations?: LawyerOfficeDB[];
  gallery?: LawyerGalleryImageDB[];
}


export interface PracticeArea {
  id: string;
  name: string;
  icon: string;
  description: string;
  casesServed: number;
}

export interface Appointment {
  id: string;
  lawyerId: string;
  lawyerName: string;
  lawyerAvatarUrl: string;
  clientName: string;
  date: string; // ISO
  type: ConsultationType;
  status: AppointmentStatus;
  fee: number;
}

export type CaseStatus = "open" | "in-progress" | "closed";

export interface LegalCase {
  id: string;
  title: string;
  description?: string;
  practiceArea: string;
  status: CaseStatus;
  priority?: "low" | "medium" | "high";
  progress: number; // 0-100
  lawyerId?: string | null;
  lawyerName?: string | null;
  lawyerAvatarUrl?: string | null;
  notes?: string;
  deletionRequestedBy?: "client" | "lawyer" | null;
  documents?: { id: string; name: string; sizeLabel: string; url?: string; category: string }[];
  createdAt?: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatarUrl: string;
  rating: number;
  comment: string;
  date: string;
  verifiedClient: boolean;
}

export interface Payment {
  id: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "refunded" | "failed";
  date: string;
  invoiceUrl?: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year: number;
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  year: number;
}

export interface CourtMembership {
  name: string;
  since: number;
}

export interface AwardEntry {
  title: string;
  issuer: string;
  year: number;
}

export interface OfficeLocation {
  label: string;
  address: string;
  city: string;
}

export interface CareerTimelineEntry {
  year: string;
  title: string;
  description: string;
}

export interface LawyerProfileExtras {
  lawyerId: string;
  education: EducationEntry[];
  certifications: CertificationEntry[];
  courtMemberships: CourtMembership[];
  awards: AwardEntry[];
  officeLocations: OfficeLocation[];
  timeline: CareerTimelineEntry[];
  galleryLabels: string[];
  faqs: { question: string; answer: string }[];
}

/** A day's worth of bookable consultation slots, generated per lawyer. */
export interface TimeSlot {
  time: string; // e.g. "10:00 AM"
  available: boolean;
}

/** Generic wrapper for async data-fetching state used across dashboards. */
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}
