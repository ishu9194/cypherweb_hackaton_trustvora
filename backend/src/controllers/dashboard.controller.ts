import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError } from "../utils/asyncHandler.js";
import { getIO } from "../socket.js";

export const getCases = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };

  const appointments = await prisma.appointment.findMany({
    where: { clientId: sub },
    orderBy: { date: "desc" },
  });

  const cases = appointments.map((a) => ({
    id: a.id,
    title: `${a.type} Consultation`,
    practiceArea: a.type,
    status: a.status === "completed" ? "closed" : a.status === "cancelled" ? "closed" : "in-progress",
    progress: a.status === "completed" ? 100 : a.status === "cancelled" ? 0 : 50,
    lawyerName: a.lawyerName,
    updatedAt: a.updatedAt.toISOString(),
  }));

  return reply.send({ success: true, data: cases });
});

export const getDocuments = asyncHandler(async (_req: FastifyRequest, reply: FastifyReply) => {
  return reply.send({ success: true, data: [] });
});

export const getNotifications = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };

  const appointments = await prisma.appointment.findMany({
    where: { clientId: sub },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  const notifications = appointments.map((a) => ({
    id: `notif-${a.id}`,
    title: `Consultation ${a.status.toUpperCase()}`,
    description: `Your ${a.type} consultation with ${a.lawyerName} is currently ${a.status}.`,
    timestamp: a.updatedAt.toISOString(),
    read: false,
    category: "appointment" as const,
  }));

  return reply.send({ success: true, data: notifications });
});

export const getMessages = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };

  const appointments = await prisma.appointment.findMany({
    where: { clientId: sub },
    include: { lawyer: true },
    orderBy: { createdAt: "desc" },
  });

  const dbMessages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: sub }, { receiverId: sub }],
    },
    orderBy: { createdAt: "asc" },
  });

  const conversationMap = new Map<string, any>();

  for (const appt of appointments) {
    const convId = appt.id;
    const msgs = dbMessages
      .filter((m) => m.conversationId === convId)
      .map((m) => ({
        id: m.id,
        senderId: m.senderId === sub ? "me" : m.senderId,
        senderName: m.senderName || appt.lawyerName,
        text: m.text,
        timestamp: m.createdAt.toISOString(),
        read: m.read,
      }));

    const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;

    conversationMap.set(convId, {
      id: convId,
      partnerName: appt.lawyerName,
      partnerAvatarUrl: appt.lawyerAvatarUrl,
      partnerRole: "lawyer",
      lawyerId: appt.lawyerId,
      lawyerName: appt.lawyerName,
      lawyerAvatarUrl: appt.lawyerAvatarUrl,
      lastMessage: lastMsg ? lastMsg.text : "Consultation requested",
      lastMessageAt: lastMsg ? lastMsg.timestamp : appt.createdAt.toISOString(),
      unreadCount: msgs.filter((m) => m.senderId !== "me" && !m.read).length,
      online: appt.lawyer?.online ?? true,
      messages: msgs,
    });
  }

  for (const m of dbMessages) {
    if (!conversationMap.has(m.conversationId)) {
      const msgs = dbMessages
        .filter((msg) => msg.conversationId === m.conversationId)
        .map((msg) => ({
          id: msg.id,
          senderId: msg.senderId === sub ? "me" : msg.senderId,
          senderName: msg.senderName || "Lawyer",
          text: msg.text,
          timestamp: msg.createdAt.toISOString(),
          read: msg.read,
        }));

      const lastMsg = msgs[msgs.length - 1];

      conversationMap.set(m.conversationId, {
        id: m.conversationId,
        partnerName: m.senderName || "Lawyer",
        partnerRole: "lawyer",
        lawyerName: m.senderName || "Lawyer",
        lastMessage: lastMsg.text,
        lastMessageAt: lastMsg.timestamp,
        unreadCount: 0,
        online: true,
        messages: msgs,
      });
    }
  }

  return reply.send({ success: true, data: Array.from(conversationMap.values()) });
});

export const sendMessage = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };
  const { id: conversationId } = req.params as { id: string };
  const { text } = req.body as { text: string };

  if (!text || !text.trim()) {
    throw new HttpError(400, "Message text is required");
  }

  const appt = await prisma.appointment.findUnique({ where: { id: conversationId } });

  const newMessage = await prisma.message.create({
    data: {
      conversationId,
      senderId: sub,
      senderName: "Client",
      receiverId: appt ? appt.lawyerId : null,
      text,
      read: false,
    },
  });

  const formatted = {
    id: newMessage.id,
    conversationId: newMessage.conversationId,
    senderId: newMessage.senderId,
    senderName: newMessage.senderName,
    receiverId: newMessage.receiverId,
    text: newMessage.text,
    read: newMessage.read,
    timestamp: newMessage.createdAt.toISOString(),
    createdAt: newMessage.createdAt.toISOString(),
  };

  const io = getIO();
  if (io) {
    io.to(`conversation_${conversationId}`).emit("receive_message", formatted);
    if (formatted.receiverId) {
      io.to(`user_${formatted.receiverId}`).emit("receive_message", formatted);
    }
  }

  return reply.send({ success: true, data: formatted });
});

export const getPayments = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };

  const appointments = await prisma.appointment.findMany({
    where: { clientId: sub },
    orderBy: { createdAt: "desc" },
  });

  const payments = appointments.map((a) => ({
    id: `pay-${a.id}`,
    description: `Consultation — ${a.lawyerName}`,
    amount: a.fee,
    status: a.status === "cancelled" ? "refunded" : "paid",
    date: a.createdAt.toISOString(),
    invoiceUrl: "#",
  }));

  return reply.send({ success: true, data: payments });
});

export const getReviews = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };

  const reviews = await prisma.review.findMany({
    where: { authorId: sub },
    orderBy: { createdAt: "desc" },
  });

  return reply.send({ success: true, data: reviews });
});
