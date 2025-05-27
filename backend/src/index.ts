import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieparser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import problemRoutes from "./routes/problem.routes";
import executionRoutes from "./routes/execution.routes";
import submissionRoutes from "./routes/submission.routes";
import playlistRoutes from "./routes/playlist.routes";

const app = express();
dotenv.config({
  path: "./.env",
});
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cookieparser());
app.use(
  cors({
    origin: process.env.CLIENT_URL as string,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
const PORT = process.env.PORT || 3000;
app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Error starting server:", err);
  });
app.get("/", (req, res) => {
  res.send("Hello Guys welcome to leetlab🔥");
});

app.use("/api/v1/health", (req, res) => {
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
// app.use(errorHandler);
