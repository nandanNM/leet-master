import {Server} from "http";
import {WebSocket, WebSocketServer} from "ws";

export interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
}
export interface Message {
  id: string;
  text: string;
  senderId: string; // important for chat
}
export interface MatchEvent {
  id: string;
  eventType: "WIN" | "LOSE" | "DRAW";
  winnerId?: string;
}
export type ServerPayload =
  | {type: "welcome"}
  | {type: "message_created"; data: Message}
  | {type: "event_created"; data: MatchEvent}
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

  function broadcastMessageCreated(message: Message) {
    broadcast(wss, {type: "message_created", data: message});
  }
  function broadcastEventCreated(event: MatchEvent) {
    broadcast(wss, {type: "event_created", data: event});
  }

  return {broadcastMessageCreated, broadcastEventCreated};
}
