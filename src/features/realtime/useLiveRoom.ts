// features/realtime/useLiveRoom.ts
import { useEffect, useState } from "react";
import { socketService } from "./socket";

export function useLiveRoom(roomId?: string, username = "web") {
  const [latest, setLatest] = useState<{ username: string; value: number } | null>(null);
  const [purchased, setPurchased] = useState(false);
  const [feed, setFeed] = useState<{ username: string; value: number; at: number }[]>([]);

  useEffect(() => {
    if (!roomId) return;
    socketService.connect();
    const join = setTimeout(() => socketService.joinRoom(roomId, username), 500);

    const handle = (d: { room: string; username: string; message: string }) => {
      if (d.room !== roomId) return;
      if (d.message === "PURCHASED") { setPurchased(true); return; }
      const price = d.message.match(/\d+/)?.[0];
      if (price) {
        setLatest({ username: d.username || "", value: Number(price) });
        setFeed((f) => [{ username: d.username || "", value: Number(price), at: Date.now() }, ...f].slice(0, 50));
      }
    };

    socketService.onMessage(handle);
    socketService.onLatest(handle);
    return () => {
      clearTimeout(join);
      socketService.offMessage(handle);
      socketService.offLatest(handle);
    };
  }, [roomId, username]);

  return { latest, purchased, feed };
}
