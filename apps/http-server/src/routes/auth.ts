import { Router } from "express";
const authRouter: Router = Router();
authRouter.post("/signup", (req, res) => {
  const { username, password } = req.body;
});
authRouter.post("/signin", (req, res) => {
  const { username, password } = req.body;
});
export default authRouter;
