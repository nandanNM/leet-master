import "@dotenvx/dotenvx/config";
import express, {Request, Response} from "express";
import cors from "cors";
import {toNodeHandler} from "better-auth/node";
import path from "path";
import morgan from "morgan";
import http from "http";

import userRoutes from "./routes/user.routes";
import problemRoutes from "./routes/problem.routes";
import executionRoutes from "./routes/execution.routes";
import submissionRoutes from "./routes/submission.routes";
import playlistRoutes from "./routes/playlist.routes";
import discussionRoutes from "./routes/discussion.route";
import codeReviewRoutes from "./routes/codereview.route";

import {auth} from "./config/auth.config";
import {asyncHandler} from "./utils/async-handler.utils";
import {ApiResponse, ApiError} from "./utils/responses.utils";
import {errorHandler} from "./middlewares/error-handler.middleware";
import {pool} from "./db";
import {attachWebSocketServer} from "./ws/server";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
const server = http.createServer(app);

// Middlewares

app.use(morgan("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(
  cors({
    origin: process.env.CLIENT_URL as string,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use("/public", express.static(path.join(process.cwd(), "src/public")));

// Auth Routes

app.use("/api/v1/auth", toNodeHandler(auth));

// Health Routes

app.get("/api/v1", (req: Request, res: Response) => {
  res.send("Hello Guys welcome to leetlab 🔥");
});

app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

// Session Route

app.get(
  "/api/v1/me",
  asyncHandler(async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      throw new ApiError(401, "Not authenticated", "UNAUTHORIZED");
    }

    new ApiResponse(200, "Session retrieved", session).send(res);
  }),
);

// API Routes

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/problem", problemRoutes);
app.use("/api/v1/execute-code", executionRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/discussion", discussionRoutes);
app.use("/api/v1/code-review", codeReviewRoutes);

// Error Middleware

app.use(errorHandler);

// WebSocket Server

const {broadcastMessageCreated, broadcastEventCreated} =
  attachWebSocketServer(server);
app.locals.broadcastMessageCreated = broadcastMessageCreated;
app.locals.broadcastEventCreated = broadcastEventCreated;

// Start Server

server.listen(Number(PORT), HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

  console.log(`🚀 Server running on ${baseUrl}`);
  console.log(`🔌 WebSocket running on ${baseUrl.replace("http", "ws")}/ws`);
});

server.on("error", (err) => {
  console.error("Server failed to start:", err);
});

// Graceful Shutdown

const shutdown = async () => {
  console.log("Shutting down server...");

  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
