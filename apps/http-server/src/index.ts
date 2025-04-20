import express from "express";
import authRouter from "./routes/auth";
import roomRouter from "./routes/room";
import dotenv from "dotenv";
import chatRouter from "./routes/chat";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cors());
const PORT = 3001;
app.use(express.json());
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use("/api/auth", authRouter);
app.use("/api/room", roomRouter);
app.use("/api/chat", chatRouter);
app.listen(PORT, () => {
  console.log("server up on port 3001");
});
