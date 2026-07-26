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

export function setupSocketIO(fastify: FastifyInstance) {
  const io = new SocketIOServer(fastify.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Socket Auth Middleware
  io.use((socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        (socket.handshake.headers?.authorization
          ? socket.handshake.headers.authorization.replace(/^Bearer\s+/, "")
          : null);

      if (!token) {
        return next(new Error("Authentication error: Token missing"));
      }

      const decoded = fastify.jwt.verify<{ sub?: string; id?: string; role?: string; email?: string }>(token);

      socket.data.user = {
        id: decoded.sub || decoded.id || "",
        role: decoded.role || "CLIENT",
        email: decoded.email,
      };

      next();
    } catch {
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user as AuthenticatedSocketData["user"];

    // Event: join_conversation
    socket.on("join_conversation", (payload: { conversationId: string }) => {
      const { conversationId } = payload || {};
      if (conversationId) {
        const room = `conversation_${conversationId}`;
        socket.join(room);
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

          // Save message to database via Prisma ORM
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

          const room = `conversation_${conversationId}`;
          io.to(room).emit("receive_message", formattedMessage);
        } catch (error) {
          console.error("Error persisting/broadcasting message:", error);
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
