import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, HttpError } from "../utils/asyncHandler.js";
import { getIO } from "../socket.js";

export const getLawyerConversations = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };

  // Get lawyer profile for this user account
  const lawyer = await prisma.lawyer.findUnique({ where: { userId: sub } });
  const lawyerId = lawyer?.id ?? sub;

  const appointments = await prisma.appointment.findMany({
    where: { lawyerId },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  const dbMessages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: sub }, { receiverId: sub }, { senderId: lawyerId }, { receiverId: lawyerId }],
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
        senderId: m.senderId === sub || m.senderId === lawyerId ? "me" : m.senderId,
        senderName: m.senderName || appt.clientName,
        text: m.text,
        timestamp: m.createdAt.toISOString(),
        read: m.read,
      }));

    const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;

    conversationMap.set(convId, {
      id: convId,
      clientId: appt.clientId,
      clientName: appt.clientName,
      clientAvatarUrl: appt.client?.walletAddress ? undefined : `https://i.pravatar.cc/160?u=${appt.clientId}`,
      lastMessage: lastMsg ? lastMsg.text : "Consultation requested",
      lastMessageAt: lastMsg ? lastMsg.timestamp : appt.createdAt.toISOString(),
      unreadCount: msgs.filter((m) => m.senderId !== "me" && !m.read).length,
      online: true,
      messages: msgs,
    });
  }

  for (const m of dbMessages) {
    if (!conversationMap.has(m.conversationId)) {
      const msgs = dbMessages
        .filter((msg) => msg.conversationId === m.conversationId)
        .map((msg) => ({
          id: msg.id,
          senderId: msg.senderId === sub || msg.senderId === lawyerId ? "me" : msg.senderId,
          senderName: msg.senderName || "Client",
          text: msg.text,
          timestamp: msg.createdAt.toISOString(),
          read: msg.read,
        }));

      const lastMsg = msgs[msgs.length - 1];

      conversationMap.set(m.conversationId, {
        id: m.conversationId,
        clientId: m.senderId,
        clientName: m.senderName || "Client",
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

export const sendLawyerReply = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };
  const { id: conversationId } = req.params as { id: string };
  const { text } = req.body as { text: string };

  if (!text || !text.trim()) {
    throw new HttpError(400, "Reply text is required");
  }

  const appt = await prisma.appointment.findUnique({ where: { id: conversationId } });

  const newMessage = await prisma.message.create({
    data: {
      conversationId,
      senderId: sub,
      senderName: "Lawyer",
      receiverId: appt ? appt.clientId : null,
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
