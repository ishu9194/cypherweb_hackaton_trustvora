/**
 * Database seed script.
 *
 * Run with: npx prisma db seed  (wired up via the "prisma.seed" field in package.json)
 *
 * NOTE: this data is transcribed from the frontend's src/data/lawyers.data.ts and
 * practiceAreas.data.ts rather than imported directly — the frontend uses Vite's
 * "@/" path aliases and lives in a separate TS project/module graph, so a live
 * cross-package import isn't practical here. If the frontend mock data changes,
 * update the arrays below to match.
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

type ConsultationType = "video" | "voice" | "office" | "chat";

interface RawLawyer {
  id: string;
  name: string;
  avatarUrl: string;
  verified: boolean;
  online: boolean;
  gender: "male" | "female" | "other";
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
  joinedAt: string;
}

function deriveConsultationTypes(lawyer: RawLawyer): ConsultationType[] {
  const hash = lawyer.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const types: ConsultationType[] = ["chat"];
  if (lawyer.online || hash % 2 === 0) types.push("video");
  if (hash % 3 !== 0) types.push("voice");
  if (hash % 4 === 0) types.push("office");
  return types;
}

const RAW_LAWYERS: RawLawyer[] = [
  { id: "lw-001", name: "Adv. Priya Sharma", avatarUrl: "https://i.pravatar.cc/160?img=47", verified: true, online: true, gender: "female", experienceYears: 12, qualification: "LLM, Harvard Law School", court: "Bombay High Court", languages: ["English", "Hindi", "Marathi"], specializations: ["Corporate Law", "Startup Law"], rating: 4.9, reviewCount: 214, consultationFee: 1500, responseTimeMinutes: 12, city: "Mumbai", state: "Maharashtra", bio: "Priya advises founders and boards on incorporation, fundraising, and governance, with a decade of experience across venture-backed startups.", casesWon: 340, successRate: 96, joinedAt: "2021-03-14T00:00:00" },
  { id: "lw-002", name: "Adv. Rohan Mehta", avatarUrl: "https://i.pravatar.cc/160?img=12", verified: true, online: false, gender: "male", experienceYears: 9, qualification: "LLB, Government Law College", court: "Delhi High Court", languages: ["English", "Hindi"], specializations: ["Criminal Law", "Cyber Crime"], rating: 4.7, reviewCount: 156, consultationFee: 1200, responseTimeMinutes: 25, city: "Delhi", state: "Delhi", bio: "Rohan has represented clients in over 200 criminal and cyber-fraud cases, known for thorough case preparation and courtroom composure.", casesWon: 188, successRate: 91, joinedAt: "2022-07-02T00:00:00" },
  { id: "lw-003", name: "Adv. Ananya Iyer", avatarUrl: "https://i.pravatar.cc/160?img=32", verified: true, online: true, gender: "female", experienceYears: 15, qualification: "LLM, National Law School Bangalore", court: "Karnataka High Court", languages: ["English", "Kannada", "Tamil"], specializations: ["Family Law", "Divorce"], rating: 5.0, reviewCount: 302, consultationFee: 1800, responseTimeMinutes: 8, city: "Bengaluru", state: "Karnataka", bio: "Ananya focuses on family mediation and contested divorce, prioritizing amicable resolution while protecting client interests.", casesWon: 410, successRate: 98, joinedAt: "2020-01-20T00:00:00" },
  { id: "lw-004", name: "Adv. Vikram Nair", avatarUrl: "https://i.pravatar.cc/160?img=51", verified: true, online: true, gender: "male", experienceYears: 7, qualification: "LLB, ILS Law College Pune", court: "Bombay High Court", languages: ["English", "Hindi", "Malayalam"], specializations: ["Property Law", "Real Estate"], rating: 4.6, reviewCount: 98, consultationFee: 1000, responseTimeMinutes: 30, city: "Pune", state: "Maharashtra", bio: "Vikram handles title verification, RERA disputes, and property litigation for individual buyers and developers alike.", casesWon: 122, successRate: 89, joinedAt: "2023-02-11T00:00:00" },
  { id: "lw-005", name: "Adv. Kavita Desai", avatarUrl: "https://i.pravatar.cc/160?img=45", verified: true, online: false, gender: "female", experienceYears: 20, qualification: "LLM, Oxford University", court: "Supreme Court of India", languages: ["English", "Hindi", "Gujarati"], specializations: ["Taxation", "GST"], rating: 4.9, reviewCount: 421, consultationFee: 2500, responseTimeMinutes: 15, city: "Mumbai", state: "Maharashtra", bio: "Kavita is a Supreme Court advocate specializing in complex tax litigation and appellate strategy for large enterprises.", casesWon: 560, successRate: 97, joinedAt: "2018-11-05T00:00:00" },
  { id: "lw-006", name: "Adv. Arjun Kapoor", avatarUrl: "https://i.pravatar.cc/160?img=14", verified: false, online: true, gender: "male", experienceYears: 4, qualification: "LLB, Symbiosis Law School", court: "Sessions Court, Pune", languages: ["English", "Hindi", "Marathi"], specializations: ["Consumer Protection", "Employment"], rating: 4.3, reviewCount: 41, consultationFee: 700, responseTimeMinutes: 40, city: "Pune", state: "Maharashtra", bio: "Arjun is a rising advocate helping employees and consumers navigate disputes with responsive, affordable representation.", casesWon: 38, successRate: 82, joinedAt: "2024-05-18T00:00:00" },
  { id: "lw-007", name: "Adv. Simran Kaur", avatarUrl: "https://i.pravatar.cc/160?img=44", verified: true, online: true, gender: "female", experienceYears: 11, qualification: "LLM, Jindal Global Law School", court: "Punjab & Haryana High Court", languages: ["English", "Hindi", "Punjabi"], specializations: ["Immigration", "Employment"], rating: 4.8, reviewCount: 176, consultationFee: 1300, responseTimeMinutes: 18, city: "Chandigarh", state: "Punjab", bio: "Simran guides individuals and companies through visa applications, work permits, and cross-border employment compliance.", casesWon: 210, successRate: 93, joinedAt: "2021-09-09T00:00:00" },
  { id: "lw-008", name: "Adv. Karthik Subramaniam", avatarUrl: "https://i.pravatar.cc/160?img=53", verified: true, online: false, gender: "male", experienceYears: 18, qualification: "LLM, National Law University Chennai", court: "Madras High Court", languages: ["English", "Tamil", "Telugu"], specializations: ["Banking Law", "Insurance"], rating: 4.8, reviewCount: 265, consultationFee: 2100, responseTimeMinutes: 20, city: "Chennai", state: "Tamil Nadu", bio: "Karthik represents banks and NBFCs in loan recovery, NPA resolution, and regulatory proceedings before tribunals.", casesWon: 305, successRate: 94, joinedAt: "2019-06-23T00:00:00" },
  { id: "lw-009", name: "Adv. Meher Fernandes", avatarUrl: "https://i.pravatar.cc/160?img=29", verified: true, online: true, gender: "female", experienceYears: 6, qualification: "LLB, Government Law College Mumbai", court: "Bombay High Court", languages: ["English", "Hindi", "Konkani"], specializations: ["Trademark", "Patent"], rating: 4.7, reviewCount: 87, consultationFee: 1600, responseTimeMinutes: 22, city: "Mumbai", state: "Maharashtra", bio: "Meher helps brands and inventors protect their intellectual property, from search and filing through opposition defense.", casesWon: 94, successRate: 90, joinedAt: "2023-08-30T00:00:00" },
  { id: "lw-010", name: "Adv. Devendra Rao", avatarUrl: "https://i.pravatar.cc/160?img=60", verified: true, online: true, gender: "male", experienceYears: 14, qualification: "LLM, NALSAR Hyderabad", court: "Telangana High Court", languages: ["English", "Telugu", "Hindi"], specializations: ["Business Registration", "GST"], rating: 4.6, reviewCount: 133, consultationFee: 1400, responseTimeMinutes: 27, city: "Hyderabad", state: "Telangana", bio: "Devendra has registered and structured over 400 companies and LLPs, with a focus on post-incorporation compliance.", casesWon: 180, successRate: 92, joinedAt: "2020-04-17T00:00:00" },
  { id: "lw-011", name: "Adv. Neha Bhatt", avatarUrl: "https://i.pravatar.cc/160?img=39", verified: false, online: false, gender: "female", experienceYears: 3, qualification: "LLB, ILS Law College Pune", court: "District Court, Ahmedabad", languages: ["English", "Hindi", "Gujarati"], specializations: ["Education Law", "Consumer Protection"], rating: 4.2, reviewCount: 29, consultationFee: 600, responseTimeMinutes: 45, city: "Ahmedabad", state: "Gujarat", bio: "Neha is building a practice around institutional disputes and admissions grievances for students and parents alike.", casesWon: 22, successRate: 79, joinedAt: "2025-01-08T00:00:00" },
  { id: "lw-012", name: "Adv. Imran Sheikh", avatarUrl: "https://i.pravatar.cc/160?img=15", verified: true, online: true, gender: "male", experienceYears: 10, qualification: "LLM, University of Delhi", court: "Delhi High Court", languages: ["English", "Hindi", "Urdu"], specializations: ["Insurance", "Civil Law"], rating: 4.5, reviewCount: 112, consultationFee: 1100, responseTimeMinutes: 33, city: "Delhi", state: "Delhi", bio: "Imran specializes in insurance claim disputes and general civil litigation, with a strong track record in tribunal hearings.", casesWon: 145, successRate: 88, joinedAt: "2022-12-01T00:00:00" },
];

const PRACTICE_AREAS = [
  { id: "corporate", name: "Corporate Law", icon: "Building2", description: "Contracts, compliance, and governance for growing businesses.", casesServed: 8200 },
  { id: "civil", name: "Civil Law", icon: "Scale", description: "Disputes between individuals or organizations resolved fairly.", casesServed: 12400 },
  { id: "criminal", name: "Criminal Law", icon: "Gavel", description: "Defense and representation across criminal proceedings.", casesServed: 6100 },
  { id: "family", name: "Family Law", icon: "Users", description: "Marriage, custody, and family matters handled with care.", casesServed: 9800 },
  { id: "property", name: "Property Law", icon: "Home", description: "Title verification, disputes, and real-estate transactions.", casesServed: 7300 },
  { id: "cyber", name: "Cyber Crime", icon: "ShieldAlert", description: "Protection against fraud, hacking, and digital harassment.", casesServed: 2900 },
  { id: "startup", name: "Startup Law", icon: "Rocket", description: "Incorporation, equity, and fundraising for founders.", casesServed: 4100 },
  { id: "gst", name: "GST", icon: "Receipt", description: "Registration, filing, and dispute resolution for GST.", casesServed: 5600 },
  { id: "taxation", name: "Taxation", icon: "Landmark", description: "Income tax planning, notices, and appellate matters.", casesServed: 6700 },
  { id: "immigration", name: "Immigration", icon: "Plane", description: "Visas, work permits, and citizenship applications.", casesServed: 3400 },
  { id: "employment", name: "Employment", icon: "Briefcase", description: "Workplace disputes, contracts, and wrongful termination.", casesServed: 5200 },
  { id: "consumer", name: "Consumer Protection", icon: "ShieldCheck", description: "Fighting unfair trade practices and defective services.", casesServed: 4400 },
  { id: "trademark", name: "Trademark", icon: "BadgeCheck", description: "Brand registration, opposition, and infringement defense.", casesServed: 3100 },
  { id: "patent", name: "Patent", icon: "Lightbulb", description: "Protecting inventions from filing through enforcement.", casesServed: 1800 },
  { id: "business-reg", name: "Business Registration", icon: "FileText", description: "Company, LLP, and partnership formation end to end.", casesServed: 6900 },
  { id: "real-estate", name: "Real Estate", icon: "Building", description: "RERA compliance, leases, and property litigation.", casesServed: 5300 },
  { id: "divorce", name: "Divorce", icon: "HeartCrack", description: "Mutual and contested divorce handled with sensitivity.", casesServed: 4700 },
  { id: "insurance", name: "Insurance", icon: "Umbrella", description: "Claim disputes and policy-related litigation support.", casesServed: 2600 },
  { id: "education", name: "Education Law", icon: "GraduationCap", description: "Admissions, institutional disputes, and compliance.", casesServed: 1400 },
  { id: "banking", name: "Banking Law", icon: "PiggyBank", description: "Loan recovery, NPAs, and regulatory representation.", casesServed: 3900 },
];

const SAMPLE_REVIEWERS = [
  { name: "Meet Agrawal", avatarUrl: "https://i.pravatar.cc/80?img=5" },
  { name: "Ishita Rao", avatarUrl: "https://i.pravatar.cc/80?img=9" },
  { name: "Aarav Shah", avatarUrl: "https://i.pravatar.cc/80?img=17" },
  { name: "Sneha Kulkarni", avatarUrl: "https://i.pravatar.cc/80?img=21" },
];

const REVIEW_COMMENTS = [
  "Clear, responsive, and genuinely invested in the outcome. Would recommend without hesitation.",
  "Walked me through every step in plain language — no jargon, no runaround.",
  "Handled a stressful situation with real professionalism. Very satisfied.",
  "Fees were transparent upfront and the advice was spot on.",
];

const DEFAULT_PASSWORD = "Password123!";

async function main() {
  console.log("Seeding practice areas…");
  for (const area of PRACTICE_AREAS) {
    await prisma.practiceArea.upsert({
      where: { id: area.id },
      update: area,
      create: area,
    });
  }

  console.log("Seeding lawyers (+ linked user accounts)…");
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  for (const raw of RAW_LAWYERS) {
    const email = `${raw.id}@trustix.dev`;
    const user = await prisma.user.upsert({
      where: { email },
      update: { name: raw.name, role: "LAWYER" },
      create: { email, name: raw.name, role: "LAWYER", passwordHash },
    });

    const lawyer = await prisma.lawyer.upsert({
      where: { userId: user.id },
      update: {
        name: raw.name,
        avatarUrl: raw.avatarUrl,
        verified: raw.verified,
        online: raw.online,
        gender: raw.gender,
        experienceYears: raw.experienceYears,
        qualification: raw.qualification,
        court: raw.court,
        languages: raw.languages,
        specializations: raw.specializations,
        rating: raw.rating,
        reviewCount: raw.reviewCount,
        consultationFee: raw.consultationFee,
        consultationTypes: deriveConsultationTypes(raw),
        responseTimeMinutes: raw.responseTimeMinutes,
        city: raw.city,
        state: raw.state,
        bio: raw.bio,
        casesWon: raw.casesWon,
        successRate: raw.successRate,
        joinedAt: new Date(raw.joinedAt),
      },
      create: {
        userId: user.id,
        name: raw.name,
        avatarUrl: raw.avatarUrl,
        verified: raw.verified,
        online: raw.online,
        gender: raw.gender,
        experienceYears: raw.experienceYears,
        qualification: raw.qualification,
        court: raw.court,
        languages: raw.languages,
        specializations: raw.specializations,
        rating: raw.rating,
        reviewCount: raw.reviewCount,
        consultationFee: raw.consultationFee,
        consultationTypes: deriveConsultationTypes(raw),
        responseTimeMinutes: raw.responseTimeMinutes,
        city: raw.city,
        state: raw.state,
        bio: raw.bio,
        casesWon: raw.casesWon,
        successRate: raw.successRate,
        joinedAt: new Date(raw.joinedAt),
      },
    });

    // A handful of sample reviews per lawyer (idempotent: skip if already seeded)
    const existingReviews = await prisma.review.count({ where: { lawyerId: lawyer.id } });
    if (existingReviews === 0) {
      const reviewCount = 2 + (raw.id.charCodeAt(raw.id.length - 1) % 3); // 2-4 reviews
      for (let i = 0; i < reviewCount; i++) {
        const reviewer = SAMPLE_REVIEWERS[i % SAMPLE_REVIEWERS.length];
        await prisma.review.create({
          data: {
            lawyerId: lawyer.id,
            authorName: reviewer.name,
            authorAvatarUrl: reviewer.avatarUrl,
            rating: Math.round(raw.rating) - (i % 2), // vary slightly around the lawyer's overall rating
            comment: REVIEW_COMMENTS[i % REVIEW_COMMENTS.length],
            verifiedClient: i % 3 !== 0,
          },
        });
      }
    }
  }

  console.log("Seeding test personas (client + admin)…");
  await prisma.user.upsert({
    where: { email: "client@trustix.dev" },
    update: { role: "CLIENT" },
    create: { email: "client@trustix.dev", name: "Meet Agrawal", role: "CLIENT", passwordHash },
  });

  await prisma.user.upsert({
    where: { email: "admin@trustix.dev" },
    update: { role: "ADMIN" },
    create: { email: "admin@trustix.dev", name: "Trustix Admin", role: "ADMIN", passwordHash },
  });

  console.log("\nDone. Test accounts (all use the same password):");
  console.log(`  Password for every seeded account: ${DEFAULT_PASSWORD}`);
  console.log("  client@trustix.dev  (CLIENT)");
  console.log("  admin@trustix.dev   (ADMIN)");
  console.log("  lw-001@trustix.dev … lw-012@trustix.dev  (LAWYER, one per seeded lawyer profile)");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
