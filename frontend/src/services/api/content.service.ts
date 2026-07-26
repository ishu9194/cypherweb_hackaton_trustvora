import { apiClient } from "./client";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorAvatarUrl?: string;
  date: string;
  readTimeMinutes: number;
  coverGradient: string;
  featured?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  description?: string;
  icon?: string;
  benefits?: string[];
  startingFee: number;
  startingPrice?: number;
  turnaroundDays: number;
  popular?: boolean;
}

export interface TestimonialItem {
  id: string;
  authorName: string;
  authorAvatarUrl?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedClient: boolean;
}

export interface TeamMemberItem {
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
}

export const contentService = {
  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      return await apiClient.get<BlogPost[]>("/content/blog");
    } catch {
      return [];
    }
  },

  async getServices(): Promise<ServiceItem[]> {
    try {
      return await apiClient.get<ServiceItem[]>("/content/services");
    } catch {
      return [];
    }
  },

  async getTestimonials(): Promise<TestimonialItem[]> {
    try {
      return await apiClient.get<TestimonialItem[]>("/content/testimonials");
    } catch {
      return [];
    }
  },

  async getFaqs(): Promise<FaqItem[]> {
    try {
      return await apiClient.get<FaqItem[]>("/content/faqs");
    } catch {
      return [];
    }
  },

  async getTeamMembers(): Promise<TeamMemberItem[]> {
    try {
      return await apiClient.get<TeamMemberItem[]>("/content/team");
    } catch {
      return [];
    }
  },
};
