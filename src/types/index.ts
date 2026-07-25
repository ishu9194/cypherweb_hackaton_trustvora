export type UserRole = "client" | "lawyer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
}

export type ConsultationType = "video" | "voice" | "office" | "chat";
export type AppointmentStatus = "upcoming" | "completed" | "cancelled" | "pending";

export type LawyerGender = "male" | "female" | "other";

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
  responseTimeMinutes: number;
  city: string;
  state: string;
  bio: string;
  casesWon: number;
  successRate: number;
  joinedAt: string; // ISO
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
  practiceArea: string;
  status: CaseStatus;
  progress: number; // 0-100
  lawyerName: string;
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
