import type { Lawyer } from "@/types";
import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

// ---------- Types ----------
export interface AdminStat {
  label: string;
  value: string | number;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
}

export interface GlobalCase {
  id: string;
  title: string;
  client: string;
  lawyer: string;
  practiceArea: string;
  status: "open" | "in-progress" | "closed";
  updatedAt: string;
}

export interface AdminClient {
  id?: string;
  name: string;
  email: string;
  joined: string;
  cases: number;
  status: "Active" | "Inactive";
}

export interface Payout {
  id: string;
  lawyer: string;
  amount: number;
  status: "processed" | "pending";
  date: string;
}

export interface RefundRequest {
  id: string;
  client: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

export interface ReportDef {
  id: string;
  name: string;
}

export interface Ticket {
  id: string;
  subject: string;
  requester: string;
  category: "Billing" | "Account" | "Booking" | "Technical";
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "resolved";
  message: string;
  createdAt: string;
}

// ---------- Service Implementation ----------
export const adminService = {
  async getStats(): Promise<AdminStat[]> {
    try {
      return await apiClient.get<AdminStat[]>(ENDPOINTS.admin.stats);
    } catch {
      return [];
    }
  },

  async getRevenue(): Promise<RevenuePoint[]> {
    try {
      return await apiClient.get<RevenuePoint[]>(ENDPOINTS.admin.revenue);
    } catch {
      return [];
    }
  },

  async getCases(): Promise<GlobalCase[]> {
    try {
      return await apiClient.get<GlobalCase[]>(ENDPOINTS.admin.cases);
    } catch {
      return [];
    }
  },

  async getClients(): Promise<AdminClient[]> {
    try {
      return await apiClient.get<AdminClient[]>(ENDPOINTS.admin.clients);
    } catch {
      return [];
    }
  },

  async getLawyers(): Promise<Lawyer[]> {
    try {
      return await apiClient.get<Lawyer[]>(ENDPOINTS.admin.lawyers);
    } catch {
      return [];
    }
  },

  async setLawyerVerified(id: string, verified: boolean): Promise<Lawyer> {
    return await apiClient.patch<Lawyer>(ENDPOINTS.admin.lawyerVerify(id), { verified });
  },

  async getPayouts(): Promise<Payout[]> {
    try {
      return await apiClient.get<Payout[]>(ENDPOINTS.admin.payouts);
    } catch {
      return [];
    }
  },

  async getRefunds(): Promise<RefundRequest[]> {
    try {
      return await apiClient.get<RefundRequest[]>(ENDPOINTS.admin.refunds);
    } catch {
      return [];
    }
  },

  async decideRefund(id: string, status: "approved" | "rejected"): Promise<RefundRequest> {
    return await apiClient.patch<RefundRequest>(ENDPOINTS.admin.refundDecision(id), { status });
  },

  async getReports(): Promise<ReportDef[]> {
    try {
      return await apiClient.get<ReportDef[]>(ENDPOINTS.admin.reports);
    } catch {
      return [];
    }
  },

  async exportReport(id: string, name: string): Promise<{ filename: string; content: string }> {
    try {
      return await apiClient.get<{ filename: string; content: string }>(ENDPOINTS.admin.reportExport(id));
    } catch {
      return { filename: `${name.replace(/\s+/g, "-")}.txt`, content: `${name}\nGenerated ${new Date().toLocaleString("en-IN")}` };
    }
  },

  async getTickets(): Promise<Ticket[]> {
    try {
      return await apiClient.get<Ticket[]>(ENDPOINTS.admin.tickets);
    } catch {
      return [];
    }
  },

  async updateTicketStatus(id: string, status: Ticket["status"]): Promise<Ticket> {
    return await apiClient.patch<Ticket>(ENDPOINTS.admin.ticketStatus(id), { status });
  },

  async replyToTicket(id: string, message: string): Promise<void> {
    return await apiClient.post<void>(ENDPOINTS.admin.ticketReply(id), { message });
  },

  async getPracticeAreas(): Promise<string[]> {
    try {
      return await apiClient.get<string[]>("/admin/practice-areas");
    } catch {
      return [];
    }
  },
};
