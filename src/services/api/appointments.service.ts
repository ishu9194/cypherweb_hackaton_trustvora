import { APPOINTMENTS } from "@/data/testimonials.data";
import type { Appointment, ConsultationType } from "@/types";
import { sleep } from "@/lib/utils";
import { apiClient, USE_MOCK_DATA } from "./client";
import { ENDPOINTS } from "./endpoints";

export interface CreateAppointmentInput {
  lawyerId: string;
  lawyerName: string;
  lawyerAvatarUrl: string;
  date: string;
  type: ConsultationType;
  fee: number;
}

let mockAppointments = [...APPOINTMENTS];

export const appointmentsService = {
  async list(): Promise<Appointment[]> {
    if (USE_MOCK_DATA) {
      await sleep(350);
      return mockAppointments;
    }
    return apiClient.get<Appointment[]>(ENDPOINTS.appointments.list);
  },

  async create(input: CreateAppointmentInput): Promise<Appointment> {
    if (USE_MOCK_DATA) {
      await sleep(500);
      const appointment: Appointment = {
        id: `ap-${Date.now()}`,
        clientName: "Meet Agrawal",
        status: "upcoming",
        ...input,
      };
      mockAppointments = [appointment, ...mockAppointments];
      return appointment;
    }
    return apiClient.post<Appointment>(ENDPOINTS.appointments.create, input);
  },

  async cancel(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await sleep(300);
      mockAppointments = mockAppointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status: "cancelled" } : appointment,
      );
      return;
    }
    await apiClient.patch(ENDPOINTS.appointments.cancel(id));
  },
};
