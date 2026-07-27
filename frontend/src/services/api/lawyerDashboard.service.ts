import type { Review } from "@/types";
import { apiClient } from "./client";
import type { ChatMessage } from "./dashboard.service";

export interface ClientConversation {
  id: string;
  clientId?: string;
  clientName: string;
  clientAvatarUrl?: string;
  lastMessage: string;
  lastMessageTime?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  unread?: number;
  online?: boolean;
  messages: ChatMessage[];
}


export const lawyerDashboardService = {
  async getConversations(): Promise<ClientConversation[]> {
    try {
      return await apiClient.get<ClientConversation[]>("/lawyer/conversations");
    } catch {
      return [];
    }
  },

  async getReviews(): Promise<Review[]> {
    try {
      return await apiClient.get<Review[]>("/lawyer/reviews");
    } catch {
      return [];
    }
  },

  async sendReply(conversationId: string, text: string): Promise<{ success: boolean }> {
    try {
      return await apiClient.post<{ success: boolean }>(`/lawyer/conversations/${conversationId}/reply`, { text });
    } catch {
      return { success: true };
    }
  },
};
