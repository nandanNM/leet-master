import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";

const app = express();
dotenv.config({
  path: "./.env",
});
app.use(express.json());
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
app.use("/api/v1/user", userRoutes);
