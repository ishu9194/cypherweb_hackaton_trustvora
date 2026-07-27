import type { Appointment, AppointmentStatus, ConsultationType } from "@/types";
import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export interface CreateAppointmentInput {
  lawyerId: string;
  lawyerName: string;
  lawyerAvatarUrl: string;
  date: string;
  type: ConsultationType;
  fee: number;
}

export const appointmentsService = {
  /** Calls GET /api/v1/appointments — scoped server-side to the authenticated client or lawyer. */
  async list(): Promise<Appointment[]> {
    return apiClient.get<Appointment[]>(ENDPOINTS.appointments.list);
  },

  /** Calls POST /api/v1/appointments */
  async create(input: CreateAppointmentInput): Promise<Appointment> {
    return apiClient.post<Appointment>(ENDPOINTS.appointments.create, input);
  },

  /** Calls PATCH /api/v1/appointments/:id/status */
  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    return apiClient.patch<Appointment>(ENDPOINTS.appointments.updateStatus(id), { status });
  },

  /** Calls PATCH /api/v1/appointments/:id/reschedule */
  async reschedule(id: string, date: string): Promise<Appointment> {
    return apiClient.patch<Appointment>(`/appointments/${id}/reschedule`, { date });
  },

  /** Convenience wrapper around updateStatus for the common cancel action. */
  async cancel(id: string): Promise<Appointment> {
    return this.updateStatus(id, "cancelled");
  },
};
