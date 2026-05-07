import {Server} from "http";
import {WebSocket, WebSocketServer} from "ws";

export interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
  challengeCode?: string;
  userId?: string;
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

export type ChallengePlayerJoinedData = {
  userId: string;
  name: string;
  participantCount: number;
  maxParticipants: number;
};

export type ChallengeStartedData = {
  challengeId: string;
  startedAt: string;
  endsAt: string;
  problem: {id: string; title: string; slug: string};
};

export type ChallengePlayerSubmittedData = {
  userId: string;
  name: string;
  rank: number;
  finishedAt: string;
};

export type ChallengeFinishedData = {
  challengeId: string;
  rankings: Array<{userId: string; name: string; rank: number | null}>;
};

export type ServerPayload =
  | {type: "welcome"}
  | {type: "match_created"; data: Match}
  | {type: "error"; message: string}
  | {type: "challenge:player_joined"; data: ChallengePlayerJoinedData}
  | {type: "challenge:started"; data: ChallengeStartedData}
  | {type: "challenge:player_submitted"; data: ChallengePlayerSubmittedData}
  | {type: "challenge:finished"; data: ChallengeFinishedData};

type ClientPayload =
  | {type: "join_challenge"; challengeCode: string; userId: string}
  | {type: "leave_challenge"};

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

function broadcastToRoom(
  wss: WebSocketServer,
  code: string,
  payload: ServerPayload,
) {
  for (const client of wss.clients) {
    const ext = client as ExtendedWebSocket;
    if (ext.readyState !== WebSocket.OPEN) continue;
    if (ext.challengeCode !== code) continue;
    ext.send(JSON.stringify(payload));
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

    socket.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as ClientPayload;

        if (msg.type === "join_challenge") {
          socket.challengeCode = msg.challengeCode?.toUpperCase();
          socket.userId = msg.userId;
        } else if (msg.type === "leave_challenge") {
          socket.challengeCode = undefined;
          socket.userId = undefined;
        }
      } catch {
        sendJson(socket, {type: "error", message: "Invalid message format"});
      }
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

  return {
    broadcastMatchCreated(match: Match) {
      broadcast(wss, {type: "match_created", data: match});
    },
    broadcastChallengePlayerJoined(
      code: string,
      data: ChallengePlayerJoinedData,
    ) {
      broadcastToRoom(wss, code, {type: "challenge:player_joined", data});
    },
    broadcastChallengeStarted(code: string, data: ChallengeStartedData) {
      broadcastToRoom(wss, code, {type: "challenge:started", data});
    },
    broadcastChallengePlayerSubmitted(
      code: string,
      data: ChallengePlayerSubmittedData,
    ) {
      broadcastToRoom(wss, code, {type: "challenge:player_submitted", data});
    },
    broadcastChallengeFinished(code: string, data: ChallengeFinishedData) {
      broadcastToRoom(wss, code, {type: "challenge:finished", data});
    },
  };
}
