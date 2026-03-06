import "@dotenvx/dotenvx/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import morgan from "morgan";

import passport from "./config/passport.config";

import userRoutes from "./routes/user.routes";
import problemRoutes from "./routes/problem.routes";
import executionRoutes from "./routes/execution.routes";
import submissionRoutes from "./routes/submission.routes";
import playlistRoutes from "./routes/playlist.routes";
import discussionRoutes from "./routes/discussion.route";
import codeReviewRoutes from "./routes/codereview.route";

// import { errorHandler } from "./middlewares/errorHandler.middleware";
import {pool} from "./db";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares

app.use(morgan("dev"));
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL as string,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(passport.initialize());

app.use("/public", express.static(path.join(process.cwd(), "src/public")));

// Routes

app.get("/", (req, res) => {
  res.send("Hello Guys welcome to leetlab 🔥");
});

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/problem", problemRoutes);
app.use("/api/v1/execute-code", executionRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/discussion", discussionRoutes);
app.use("/api/v1/code-review", codeReviewRoutes);

// app.use(errorHandler);

// Server Start

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("Server failed to start:", err);
});

// Graceful Shutdown

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing server...");
  server.close(async () => {
    await pool.end(); // if using postgres
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Closing server...");
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
});
