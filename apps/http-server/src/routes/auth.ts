import { Router } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { createUserSchema, signinSchema } from "@repo/common/types";
const authRouter: Router = Router();
authRouter.post("/signup", (req, res) => {
  const data = createUserSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  const { username, password, name } = req.body;
  res.json({
    message: "user created",
  });
});
authRouter.post("/signin", (req, res) => {
  const data = signinSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  if (!JWT_SECRET) {
    console.log("no jwt secret");
    return;
  }
  const token = jwt.sign(
    {
      userId: 1,
    },
    JWT_SECRET
  );
  res.json({
    token,
    message: "user signed in",
  });
});
export default authRouter;
