import { Server as SocketIOServer, Socket } from "socket.io";
import type { FastifyInstance } from "fastify";
import { prisma } from "./lib/prisma.js";

export interface AuthenticatedSocketData {
  user: {
    id: string;
    role: string;
    email?: string;
  };
}

let ioInstance: SocketIOServer | null = null;

export function getIO(): SocketIOServer | null {
  return ioInstance;
}

export function emitAppointmentStatusChanged(appointment: any) {
  if (!ioInstance || !appointment) return;
  const payload = {
    appointmentId: appointment.id,
    status: appointment.status,
    clientId: appointment.clientId,
    lawyerId: appointment.lawyerId,
    timestamp: new Date().toISOString(),
  };
  ioInstance.to(`user_${appointment.clientId}`).emit("APPOINTMENT_STATUS_CHANGED", payload);
  ioInstance.to(`user_${appointment.lawyerId}`).emit("APPOINTMENT_STATUS_CHANGED", payload);
  ioInstance.to(`conversation_${appointment.id}`).emit("APPOINTMENT_STATUS_CHANGED", payload);
}

export function emitNewAppointment(appointment: any) {
  if (!ioInstance || !appointment) return;
  ioInstance.to(`user_${appointment.lawyerId}`).emit("NEW_APPOINTMENT", appointment);
}

export function emitNewReview(review: any) {
  if (!ioInstance || !review) return;
  ioInstance.emit("NEW_REVIEW", review);
}

export function emitTrustScoreUpdated(lawyerId: string, trustScore: number, rating: number) {
  if (!ioInstance || !lawyerId) return;
  ioInstance.emit("TRUST_SCORE_UPDATED", { lawyerId, trustScore, rating });
}

export function setupSocketIO(fastify: FastifyInstance) {
  const io = new SocketIOServer(fastify.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  ioInstance = io;

  // Socket Auth Middleware
  io.use((socket: Socket, next) => {
    try {
      let rawToken: string | undefined =
        socket.handshake.auth?.token ||
        (socket.handshake.headers?.authorization as string | undefined);

      if (!rawToken) {
        return next(new Error("Authentication error: Token missing"));
      }

      // Clean 'Bearer ' prefix whether passed in auth.token or Authorization header
      const token = rawToken.replace(/^Bearer\s+/i, "").trim();

      if (!token) {
        return next(new Error("Authentication error: Empty token"));
      }

      const decoded = fastify.jwt.verify<{ sub?: string; id?: string; role?: string; email?: string }>(token);

      const userId = decoded.sub || decoded.id || "";
      if (!userId) {
        return next(new Error("Authentication error: Invalid user identity in token"));
      }

      socket.data.user = {
        id: userId,
        role: decoded.role || "CLIENT",
        email: decoded.email,
      };

      next();
    } catch (err: any) {
      console.error("Socket authentication error:", err.message);
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user as AuthenticatedSocketData["user"];

    // Automatically join user's personal room for direct notification delivery
    if (user?.id) {
      const personalRoom = `user_${user.id}`;
      socket.join(personalRoom);
    }

    // Event: join_conversation
    socket.on("join_conversation", (payload: { conversationId: string }) => {
      const { conversationId } = payload || {};
      if (conversationId) {
        const room = `conversation_${conversationId}`;
        socket.join(room);
      }
    });

    // Event: resubscribe_rooms (for client reconnection room restore)
    socket.on("resubscribe_rooms", (payload: { conversationIds: string[] }) => {
      const { conversationIds } = payload || {};
      if (Array.isArray(conversationIds)) {
        for (const cid of conversationIds) {
          if (cid) {
            socket.join(`conversation_${cid}`);
          }
        }
      }
    });

    // Event: send_message
    socket.on(
      "send_message",
      async (payload: {
        conversationId: string;
        content?: string;
        text?: string;
        receiverId?: string;
        senderName?: string;
        attachment?: any;
      }) => {
        try {
          const { conversationId, content, text, receiverId, senderName, attachment } = payload || {};
          const messageText = content || text || "";

          if (!conversationId || !messageText.trim()) return;

          let attachmentStr: string | null = null;
          if (attachment) {
            attachmentStr = typeof attachment === "string" ? attachment : JSON.stringify(attachment);
          }

          // Save message to PostgreSQL via Prisma ORM
          const newMessage = await prisma.message.create({
            data: {
              conversationId,
              senderId: user?.id || "unknown",
              senderName: senderName || "User",
              receiverId: receiverId || null,
              text: messageText,
              attachment: attachmentStr,
              read: false,
            },
          });

          let parsedAttachment: any = undefined;
          if (newMessage.attachment) {
            try {
              parsedAttachment = JSON.parse(newMessage.attachment);
            } catch {
              parsedAttachment = newMessage.attachment;
            }
          }

          const formattedMessage = {
            id: newMessage.id,
            conversationId: newMessage.conversationId,
            senderId: newMessage.senderId,
            senderName: newMessage.senderName,
            receiverId: newMessage.receiverId,
            text: newMessage.text,
            content: newMessage.text,
            attachment: parsedAttachment,
            read: newMessage.read,
            timestamp: newMessage.createdAt.toISOString(),
            createdAt: newMessage.createdAt.toISOString(),
          };

          const convRoom = `conversation_${conversationId}`;
          socket.to(convRoom).emit("receive_message", formattedMessage);

          if (receiverId) {
            io.to(`user_${receiverId}`).emit("receive_message", formattedMessage);
          }
        } catch (error) {
          console.error("Error persisting/broadcasting socket message:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      },
    );

    // Event: typing
    socket.on("typing", (payload: { conversationId: string; isTyping: boolean }) => {
      const { conversationId, isTyping } = payload || {};
      if (conversationId) {
        const room = `conversation_${conversationId}`;
        socket.to(room).emit("user_typing", {
          conversationId,
          userId: user?.id,
          isTyping: !!isTyping,
        });
      }
    });
  });

  return io;
}
