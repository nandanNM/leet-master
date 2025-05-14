import express from "express";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});
const app = express();
const PORT = process.env.PORT || 3000;

app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Error starting server:", err);
  });
app.get("/", (req, res) => {
  res.send("Hello World!");
});
