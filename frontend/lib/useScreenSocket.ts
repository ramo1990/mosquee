// src/lib/useScreenSocket.ts

"use client";

import { useEffect, useRef, useState } from "react";
import type { Announcement } from "@/lib/types";

export type ScreenSocketMessage = {
  event: "created" | "updated" | "deleted";
  announcement: Announcement;
};

export function useScreenSocket(
  screenId: number,
  onMessage: (message: ScreenSocketMessage) => void
) {
  const [connected, setConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);

  // Synchronise le callback après le rendu, sans modifier la ref pendant celui-ci.
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "ws://127.0.0.1:8004";

    let retryTimeout: ReturnType<typeof setTimeout> | null = null;
    let closedByCleanup = false;

    function connect() {
      if (closedByCleanup) return;

      const socket = new WebSocket(`${wsUrl}/ws/ecran/${screenId}/`);
      socketRef.current = socket;

      socket.onopen = () => {
        setConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(
            event.data
          ) as ScreenSocketMessage;

          onMessageRef.current(message);
        } catch {
          // Ignore les messages WebSocket invalides.
        }
      };

      socket.onclose = () => {
        if (socketRef.current === socket) {
          socketRef.current = null;
          setConnected(false);
        }

        if (!closedByCleanup) {
          retryTimeout = setTimeout(connect, 5000);
        }
      };

      socket.onerror = () => {
        socket.close();
      };
    }

    connect();

    return () => {
      closedByCleanup = true;

      if (retryTimeout !== null) {
        clearTimeout(retryTimeout);
      }

      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [screenId]);

  return { connected };
}