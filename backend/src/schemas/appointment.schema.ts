import { z } from "zod";

export const CreateAppointmentSchema = z.object({
  lawyerId: z.string().min(1),
  lawyerName: z.string().min(1),
  lawyerAvatarUrl: z.string().min(1),
  date: z.string().min(1),
  type: z.enum(["video", "voice", "office", "chat"]),
  fee: z.number().int().nonnegative(),
});
export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>;

export const UpdateAppointmentStatusSchema = z.object({
  status: z.enum(["pending", "upcoming", "completed", "cancelled"]),
});
export type UpdateAppointmentStatusInput = z.infer<typeof UpdateAppointmentStatusSchema>;
