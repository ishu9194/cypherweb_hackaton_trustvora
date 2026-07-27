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

export const getDocuments = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };

  const documents = await prisma.document.findMany({
    where: { userId: sub },
    orderBy: { createdAt: "desc" },
  });

  const formatted = documents.map((d) => ({
    id: d.id,
    name: d.name,
    category: d.category,
    sizeLabel: d.sizeLabel,
    uploadedAt: d.createdAt.toISOString(),
    url: d.url || "#",
  }));

  return reply.send({ success: true, data: formatted });
});

export const uploadDocument = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };
  const { name, category, sizeLabel, url } = req.body as {
    name: string;
    category?: string;
    sizeLabel?: string;
    url?: string;
  };

  if (!name || !name.trim()) {
    throw new HttpError(400, "Document name is required");
  }

  const doc = await prisma.document.create({
    data: {
      userId: sub,
      name,
      category: category || "General",
      sizeLabel: sizeLabel || "1.2 MB",
      url: url || null,
    },
  });

  return reply.status(201).send({
    success: true,
    data: {
      id: doc.id,
      name: doc.name,
      category: doc.category,
      sizeLabel: doc.sizeLabel,
      uploadedAt: doc.createdAt.toISOString(),
      url: doc.url || "#",
    },
  });
});

export const deleteDocument = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };
  const { id } = req.params as { id: string };

  const doc = await prisma.document.findFirst({
    where: { id, userId: sub },
  });

  if (!doc) {
    throw new HttpError(404, "Document not found");
  }

  await prisma.document.delete({ where: { id } });

  return reply.send({ success: true, message: "Document deleted successfully" });
});

export const getSavedLawyers = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };

  const saved = await prisma.savedLawyer.findMany({
    where: { userId: sub },
    include: { lawyer: true },
    orderBy: { createdAt: "desc" },
  });

  const lawyers = saved.map((s) => s.lawyer);

  return reply.send({ success: true, data: lawyers });
});

export const toggleSaveLawyer = asyncHandler(async (req: FastifyRequest, reply: FastifyReply) => {
  const { sub } = req.user as { sub: string };
  const { id: lawyerId } = req.params as { id: string };

  const existing = await prisma.savedLawyer.findFirst({
    where: { userId: sub, lawyerId },
  });


  if (existing) {
    await prisma.savedLawyer.delete({
      where: { id: existing.id },
    });
    return reply.send({ success: true, saved: false, message: "Lawyer removed from saved list" });
  } else {
    await prisma.savedLawyer.create({
      data: {
        userId: sub,
        lawyerId,
      },
    });
    return reply.send({ success: true, saved: true, message: "Lawyer saved successfully" });
  }
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

  if (conversationMap.size === 0) {
    const topLawyers = await prisma.lawyer.findMany({
      take: 4,
      orderBy: { rating: "desc" },
    });

    for (const l of topLawyers) {
      conversationMap.set(`conv-${l.id}`, {
        id: `conv-${l.id}`,
        partnerName: l.name,
        partnerAvatarUrl: l.avatarUrl,
        partnerRole: "lawyer",
        lawyerId: l.id,
        lawyerName: l.name,
        lawyerAvatarUrl: l.avatarUrl,
        lastMessage: "Click to start consultation chat",
        lastMessageAt: l.joinedAt ? l.joinedAt.toISOString() : new Date().toISOString(),
        unreadCount: 0,
        online: l.online,
        messages: [],
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
