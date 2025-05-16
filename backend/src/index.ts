import express from "express";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import probleamRoutes from "./routes/probleam.routes";

const app = express();
dotenv.config({
  path: "./.env",
});
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieparser());
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
  res.status(201).json({
    status: "success",
    message: "Server is running",
  });
});
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/probleams", probleamRoutes);
