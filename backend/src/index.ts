import "@dotenvx/dotenvx/config";
import express, {Request, Response} from "express";
import cors from "cors";
import {toNodeHandler} from "better-auth/node";
import path from "path";
import morgan from "morgan";

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
app.use(
  cors({
    origin: process.env.CLIENT_URL as string,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use("/public", express.static(path.join(process.cwd(), "src/public")));

// Better-auth router
app.use("/api/v1/auth", toNodeHandler(auth));

// Routes
app.get("/api/v1", (req: Request, res: Response) => {
  res.send("Hello Guys welcome to leetlab 🔥");
});

app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

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

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/problem", problemRoutes);
app.use("/api/v1/execute-code", executionRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/discussion", discussionRoutes);
app.use("/api/v1/code-review", codeReviewRoutes);

// Server Start
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Server is running on port http://localhost:${PORT}`);
});
// app.use(errorHandler);

server.on("error", (err) => {
  console.error("Server failed to start:", err);
});

// Graceful Shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing server...");
  server.close(async () => {
    await pool.end();
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
