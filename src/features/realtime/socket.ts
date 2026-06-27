// features/realtime/socket.ts
import { io, type Socket } from "socket.io-client";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:6200";
const socket: Socket = io(BASE, { autoConnect: false });

export const socketService = {
  socket,
  connect() { if (!socket.connected) socket.connect(); },
  disconnect() { socket.disconnect(); },
  joinRoom(room: string, username: string) { socket.emit("join_room", room, username); },
  sendMessage(d: { room: string; username: string; message: string }) { socket.emit("send_message", d); },
  onMessage(cb: (d: { room: string; username: string; message: string }) => void) { socket.on("receive_message", cb); },
  offMessage(cb: (d: any) => void) { socket.off("receive_message", cb); },
  onLatest(cb: (d: { room: string; username: string; message: string }) => void) { socket.on("latest_message", cb); },
  offLatest(cb: (d: any) => void) { socket.off("latest_message", cb); },
};
