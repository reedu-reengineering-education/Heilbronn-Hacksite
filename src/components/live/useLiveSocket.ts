"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  parseServerMessage,
  type ClientMessage,
  type ServerMessage,
} from "@/lib/live/protocol";

/**
 * Connects to /ws/live, says hello, and reconnects with backoff when the
 * connection drops — phones lock, Wi-Fi drops, and the room has to survive it.
 */
export function useLiveSocket(options: {
  code: string;
  role: "player" | "host";
  token?: string;
  adminToken?: string;
  onMessage: (message: ServerMessage) => void;
}) {
  const { code, role, token, adminToken, onMessage } = options;

  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const attemptsRef = useRef(0);
  const closedRef = useRef(false);

  // Keep the latest handler without making it a reconnect trigger.
  const handlerRef = useRef(onMessage);
  useEffect(() => {
    handlerRef.current = onMessage;
  }, [onMessage]);

  const send = useCallback((message: ClientMessage) => {
    const socket = socketRef.current;
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
  }, []);

  useEffect(() => {
    closedRef.current = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let keepAlive: ReturnType<typeof setInterval> | undefined;

    function connect() {
      if (closedRef.current) return;

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const socket = new WebSocket(`${protocol}//${window.location.host}/ws/live`);
      socketRef.current = socket;

      socket.onopen = () => {
        attemptsRef.current = 0;
        setConnected(true);
        socket.send(JSON.stringify({ t: "hello", code, role, token, adminToken }));
        keepAlive = setInterval(() => socket.send(JSON.stringify({ t: "ping" })), 25_000);
      };

      socket.onmessage = (event) => {
        const message = parseServerMessage(String(event.data));
        if (message && message.t !== "pong") handlerRef.current(message);
      };

      socket.onclose = () => {
        setConnected(false);
        if (keepAlive) clearInterval(keepAlive);
        if (closedRef.current) return;
        attemptsRef.current += 1;
        const delay = Math.min(1000 * 2 ** (attemptsRef.current - 1), 10_000);
        reconnectTimer = setTimeout(connect, delay);
      };

      socket.onerror = () => socket.close();
    }

    connect();

    return () => {
      closedRef.current = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (keepAlive) clearInterval(keepAlive);
      socketRef.current?.close();
    };
  }, [code, role, token, adminToken]);

  return { connected, send };
}

/** Counts down to an epoch timestamp; returns whole seconds remaining. */
export function useCountdown(endsAt: number | null): number {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!endsAt) {
      setRemaining(0);
      return;
    }
    const tick = () => setRemaining(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [endsAt]);

  return remaining;
}
