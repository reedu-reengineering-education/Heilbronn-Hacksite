import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";
import { WebSocketServer, type WebSocket } from "ws";
import type { ClientMessage } from "@/lib/live/protocol";
import { verifyAdminToken, verifyTeamToken } from "@/lib/session-core";
import { hostAction, joinAsHost, joinAsPlayer, leave, submitAnswer } from "@/lib/live/engine";

/**
 * Next.js cannot serve WebSockets from a route handler, so the app runs behind
 * a small custom server: HTTP goes to Next, `/ws/live` is upgraded and handed
 * to the quiz engine.
 */

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT ?? 3000);
const hostname = process.env.HOSTNAME ?? "0.0.0.0";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

type SocketState = {
  code: string | null;
  role: "player" | "host" | null;
  teamId: number | null;
  alive: boolean;
};

const state = new WeakMap<WebSocket, SocketState>();

function reply(socket: WebSocket, message: object): void {
  if (socket.readyState === socket.OPEN) socket.send(JSON.stringify(message));
}

async function onMessage(socket: WebSocket, raw: string): Promise<void> {
  let message: ClientMessage;
  try {
    message = JSON.parse(raw) as ClientMessage;
  } catch {
    return;
  }

  const current = state.get(socket);
  if (!current) return;

  switch (message.t) {
    case "ping": {
      reply(socket, { t: "pong" });
      return;
    }

    case "hello": {
      const code = String(message.code ?? "").trim().toUpperCase();
      if (!code) {
        reply(socket, { t: "error", code: "badRequest", message: "Missing game code." });
        return;
      }

      if (message.role === "host") {
        const ok = message.adminToken ? await verifyAdminToken(message.adminToken) : false;
        if (!ok) {
          reply(socket, { t: "error", code: "unauthorized", message: "Organiser login required." });
          socket.close();
          return;
        }
        if (!(await joinAsHost(code, socket))) {
          reply(socket, { t: "error", code: "notFound", message: "No game with that code." });
          socket.close();
          return;
        }
        state.set(socket, { ...current, code, role: "host", teamId: null });
        return;
      }

      const team = message.token ? await verifyTeamToken(message.token) : null;
      if (!team) {
        reply(socket, { t: "error", code: "unauthorized", message: "Team sign-in required." });
        socket.close();
        return;
      }
      if (!(await joinAsPlayer(code, socket, team))) {
        reply(socket, { t: "error", code: "notFound", message: "No game with that code." });
        socket.close();
        return;
      }
      state.set(socket, { ...current, code, role: "player", teamId: team.teamId });
      return;
    }

    case "answer": {
      if (current.role !== "player" || !current.code || current.teamId === null) return;
      submitAnswer(current.code, current.teamId, message.questionId, String(message.value ?? ""));
      return;
    }

    case "host": {
      if (current.role !== "host" || !current.code) return;
      await hostAction(current.code, message.action);
      return;
    }
  }
}

async function main(): Promise<void> {
  await app.prepare();

  const server = createServer((req, res) => {
    handle(req, res, parse(req.url ?? "/", true)).catch((error: unknown) => {
      console.error("Request failed:", error);
      res.statusCode = 500;
      res.end("Internal server error");
    });
  });

  const wss = new WebSocketServer({ noServer: true });

  wss.on("connection", (socket: WebSocket) => {
    state.set(socket, { code: null, role: null, teamId: null, alive: true });

    socket.on("message", (data) => {
      void onMessage(socket, data.toString()).catch((error: unknown) => {
        console.error("WebSocket message failed:", error);
      });
    });

    socket.on("pong", () => {
      const current = state.get(socket);
      if (current) current.alive = true;
    });

    socket.on("close", () => {
      leave(socket);
      state.delete(socket);
    });

    socket.on("error", () => {
      leave(socket);
      state.delete(socket);
    });
  });

  // Drop sockets that stopped responding — phones on flaky conference Wi-Fi
  // often disappear without a close frame.
  const heartbeat = setInterval(() => {
    for (const socket of wss.clients) {
      const current = state.get(socket);
      if (current && !current.alive) {
        socket.terminate();
        continue;
      }
      if (current) current.alive = false;
      socket.ping();
    }
  }, 30_000);
  heartbeat.unref();

  server.on("upgrade", (req, socket, head) => {
    const { pathname } = parse(req.url ?? "/");
    if (pathname !== "/ws/live") {
      // Leave anything else alone (Next's dev HMR socket lives on /_next).
      if (pathname?.startsWith("/_next")) return;
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  server.listen(port, hostname, () => {
    console.log(`> Hacksite ready on http://${hostname}:${port} (ws on /ws/live)`);
  });
}

main().catch((error: unknown) => {
  console.error("Failed to start:", error);
  process.exit(1);
});
