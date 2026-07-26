import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "./api/client";
import { STORAGE_KEYS } from "@/constants/app.constants";

let socketInstance: Socket | null = null;

export function getSocketServerUrl(): string {
  return API_BASE_URL.replace(/\/api(\/v\d+)?\/?$/, "");
}

export function getSocket(): Socket {
  if (!socketInstance) {
    const token = localStorage.getItem(STORAGE_KEYS.authToken) || localStorage.getItem("token") || "";
    const serverUrl = getSocketServerUrl();

    socketInstance = io(serverUrl, {
      auth: { token },
      autoConnect: true,
    });
  }

  if (socketInstance.disconnected) {
    const token = localStorage.getItem(STORAGE_KEYS.authToken) || localStorage.getItem("token") || "";
    socketInstance.auth = { token };
    socketInstance.connect();
  }

  return socketInstance;
}

export function joinConversation(conversationId: string) {
  const socket = getSocket();
  socket.emit("join_conversation", { conversationId });
}

export function sendSocketMessage(payload: {
  conversationId: string;
  content?: string;
  text?: string;
  receiverId?: string;
  senderName?: string;
  attachment?: any;
}) {
  const socket = getSocket();
  socket.emit("send_message", payload);
}

export function emitTyping(conversationId: string, isTyping: boolean) {
  const socket = getSocket();
  socket.emit("typing", { conversationId, isTyping });
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
