import express from "express";
import authRouter from "./routes/auth";
const app = express();
const PORT = 3001;
app.use(express.json());
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use("/api/auth", authRouter);
app.listen(3001, () => {
  console.log("server up on port 3000");
});
