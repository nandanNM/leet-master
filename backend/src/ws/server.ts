import {Server} from "http";
import {WebSocket, WebSocketServer} from "ws";

export interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
}
export interface Match {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: "scheduled" | "live" | "finished";
}
export type ServerPayload =
  | {type: "welcome"}
  | {type: "match_created"; data: Match}
  | {type: "error"; message: string};

function sendJson(socket: WebSocket, payload: ServerPayload) {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify(payload));
}

function broadcast(wss: WebSocketServer, payload: ServerPayload) {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;

    client.send(JSON.stringify(payload));
  }
}

export function attachWebSocketServer(server: Server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024,
  });

  wss.on("connection", (socket: ExtendedWebSocket) => {
    socket.isAlive = true;
    socket.on("pong", () => {
      socket.isAlive = true;
    });

    sendJson(socket, {type: "welcome"});

    socket.on("error", console.error);
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const extSocket = ws as ExtendedWebSocket;

      if (extSocket.isAlive === false) {
        return extSocket.terminate();
      }

      extSocket.isAlive = false;
      extSocket.ping();
    });
  }, 30000);

  wss.on("close", () => clearInterval(interval));

  function broadcastMatchCreated(match: Match) {
    broadcast(wss, {type: "match_created", data: match});
  }

  return {broadcastMatchCreated};
}
