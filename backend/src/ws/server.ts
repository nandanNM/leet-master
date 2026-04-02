import {Server} from "http";
import {WebSocket, WebSocketServer} from "ws";

export interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
  subscriptions: Set<string>;
  id: string;
  userId?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
}

export interface MatchEvent {
  id: string;
  eventType: "WIN" | "LOSE" | "DRAW" | "MATCH_STARTED";
  winnerId?: string;
}

// Payloads the client sends to the server
type ClientPayload =
  | {type: "subscribe"; matchId: string; userId: string}
  | {type: "unsubscribe"; matchId: string}
  | {type: "send_message"; matchId: string; text: string};

// Payloads the server sends to clients
export type ServerPayload =
  | {type: "welcome"}
  | {type: "subscribed"; matchId: string}
  | {type: "unsubscribed"; matchId: string}
  | {type: "message_created"; data: Message}
  | {type: "match_event"; data: MatchEvent}
  | {type: "error"; message: string};

// matchId -> set of subscribed sockets
const matchSubscribers = new Map<string, Set<WebSocket>>();

function subscribe(matchId: string, socket: WebSocket) {
  if (!matchSubscribers.has(matchId)) {
    matchSubscribers.set(matchId, new Set<WebSocket>());
  }
  matchSubscribers.get(matchId)!.add(socket);
}

function unsubscribe(matchId: string, socket: WebSocket) {
  const subscribers = matchSubscribers.get(matchId);
  if (!subscribers) return;
  subscribers.delete(socket);
  if (subscribers.size === 0) matchSubscribers.delete(matchId);
}

// Remove socket from all matches it was subscribed to
function cleanupSubscribers(socket: ExtendedWebSocket) {
  for (const matchId of socket.subscriptions) {
    unsubscribe(matchId, socket);
  }
}

function sendJson(socket: WebSocket, payload: ServerPayload) {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}

// Send to all connected clients across all matches
function broadcastToAll(wss: WebSocketServer, payload: ServerPayload) {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;
    client.send(JSON.stringify(payload));
  }
}

// Send to all subscribers of a specific match
function broadcastToMatchSubscribers(matchId: string, payload: ServerPayload) {
  const subscribers = matchSubscribers.get(matchId);
  if (!subscribers || subscribers.size === 0) return;
  const raw = JSON.stringify(payload);
  for (const client of subscribers) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(raw);
    }
  }
}

function handleMessage(socket: ExtendedWebSocket, data: any) {
  let message: ClientPayload;
  try {
    message = JSON.parse(data.toString());
  } catch (error) {
    sendJson(socket, {type: "error", message: "Invalid JSON"});
    return;
  }

  if (message.type === "subscribe") {
    socket.userId = message.userId;
    subscribe(message.matchId, socket);
    socket.subscriptions.add(message.matchId);
    sendJson(socket, {type: "subscribed", matchId: message.matchId});
  }
  // check how many users are subscribed to the match

  if (message.type === "unsubscribe") {
    unsubscribe(message.matchId, socket);
    socket.subscriptions.delete(message.matchId);
    sendJson(socket, {type: "unsubscribed", matchId: message.matchId});
  }

  if (message.type === "send_message") {
    // Socket must be subscribed to the match before sending messages
    if (!socket.subscriptions.has(message.matchId)) {
      sendJson(socket, {
        type: "error",
        message: "Not subscribed to this match",
      });
      return;
    }

    const msg: Message = {
      id: crypto.randomUUID(),
      text: message.text,
      senderId: socket.id,
    };

    broadcastToMatchSubscribers(message.matchId, {
      type: "message_created",
      data: msg,
    });
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
    socket.id = crypto.randomUUID();
    socket.subscriptions = new Set();

    socket.on("pong", () => {
      socket.isAlive = true;
    });

    sendJson(socket, {type: "welcome"});

    socket.on("message", (data) => {
      handleMessage(socket, data);
    });

    socket.on("error", (err) => {
      console.error(err);
      socket.terminate();
    });

    socket.on("close", () => {
      cleanupSubscribers(socket);
    });
  });

  // Ping all clients every 30s and terminate unresponsive ones
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

  // Broadcast a chat message to all clients (global)
  function broadcastMessageCreated(message: Message) {
    broadcastToAll(wss, {type: "message_created", data: message});
  }

  // Broadcast a match event to all clients (global)
  function broadcastEventCreated(event: MatchEvent) {
    broadcastToAll(wss, {type: "match_event", data: event});
  }

  // Broadcast a match event only to subscribers of that match
  function broadcastMatchEvent(matchId: string, event: MatchEvent) {
    broadcastToMatchSubscribers(matchId, {type: "match_event", data: event});
  }

  return {broadcastMessageCreated, broadcastEventCreated, broadcastMatchEvent};
}
