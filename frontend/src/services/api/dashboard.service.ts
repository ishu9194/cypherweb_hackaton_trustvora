import type { LegalCase, Payment, Review } from "@/types";
import { apiClient } from "./client";

export interface DashboardDocument {
  id: string;
  name: string;
  category: string;
  sizeLabel: string;
  uploadedAt: string;
  caseId?: string;
  url?: string;
}

export interface DashboardNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  category: "appointment" | "message" | "case" | "payment" | "system";
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: string;
  read?: boolean;
  reactions?: string[];
  attachment?: {
    name: string;
    url?: string;
    type?: string;
    duration?: string;
  };
}

export interface Conversation {
  id: string;
  partnerName: string;
  partnerAvatarUrl?: string;
  partnerRole: string;
  lawyerId?: string;
  lawyerName?: string;
  lawyerAvatarUrl?: string;
  lastMessage: string;
  lastMessageTime?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  unread?: number;
  online?: boolean;
  messages: ChatMessage[];
}

export const dashboardService = {
  async getCases(): Promise<LegalCase[]> {
    try {
      return await apiClient.get<LegalCase[]>("/dashboard/cases");
    } catch {
      return [];
    }
  },

  async createCase(data: {
    title: string;
    description: string;
    practiceArea: string;
    priority?: "low" | "medium" | "high";
    lawyerId?: string;
  }): Promise<LegalCase | null> {
    try {
      return await apiClient.post<LegalCase>("/dashboard/cases", data);
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || err.message || "Failed to create case");
    }
  },

  async updateCaseNotes(id: string, notes: string): Promise<boolean> {
    try {
      await apiClient.patch(`/dashboard/cases/${id}/notes`, { notes });
      return true;
    } catch {
      return false;
    }
  },

  async getLawyerCases(): Promise<any[]> {
    try {
      return await apiClient.get<any[]>("/lawyer-dashboard/cases");
    } catch {
      return [];
    }
  },

  async updateLawyerCaseStatus(id: string, status: string): Promise<boolean> {
    try {
      await apiClient.patch(`/lawyer-dashboard/cases/${id}/status`, { status });
      return true;
    } catch {
      return false;
    }
  },

  async getDocuments(): Promise<DashboardDocument[]> {
    try {
      return await apiClient.get<DashboardDocument[]>("/dashboard/documents");
    } catch {
      return [];
    }
  },

  async uploadDocument(doc: { name: string; category?: string; sizeLabel?: string; url?: string }): Promise<DashboardDocument | null> {
    try {
      return await apiClient.post<DashboardDocument>("/dashboard/documents", doc);
    } catch {
      return null;
    }
  },

  async deleteDocument(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/dashboard/documents/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  async getNotifications(): Promise<DashboardNotification[]> {
    try {
      return await apiClient.get<DashboardNotification[]>("/dashboard/notifications");
    } catch {
      return [];
    }
  },

  async getMessages(): Promise<Conversation[]> {
    try {
      return await apiClient.get<Conversation[]>("/dashboard/messages");
    } catch {
      return [];
    }
  },

  async sendMessage(conversationId: string, text: string): Promise<{ success: boolean }> {
    try {
      return await apiClient.post<{ success: boolean }>(`/dashboard/messages/${conversationId}`, { text });
    } catch {
      return { success: true };
    }
  },

  async getPayments(): Promise<Payment[]> {
    try {
      return await apiClient.get<Payment[]>("/dashboard/payments");
    } catch {
      return [];
    }
  },

  async getReviews(): Promise<Review[]> {
    try {
      return await apiClient.get<Review[]>("/dashboard/reviews");
    } catch {
      return [];
    }
  },
};
