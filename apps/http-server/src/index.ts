import express from "express";
import authRouter from "./routes/auth";
import roomRouter from "./routes/room";
import dotenv from "dotenv";
import chatRouter from "./routes/chat";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerjsdoc from 'swagger-jsdoc'
import { swaggerOptions } from "./config/swagger";
dotenv.config();
const app = express();
app.use(cors());
const PORT = 3002;
app.use(express.json());
app.get("/", (req, res) => {
  res.send("hello world");
});
const swaggerDocs = swaggerjsdoc(swaggerOptions as unknown as swaggerjsdoc.Options)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/auth", authRouter);
app.use("/api/room", roomRouter);
app.use("/api/chat", chatRouter);
app.listen(PORT, () => {
  console.log(`server up on port ${PORT}`);
});
