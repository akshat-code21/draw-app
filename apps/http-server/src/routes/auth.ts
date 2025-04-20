import { Router } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { createUserSchema, signinSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
const saltRounds = 10;
const authRouter: Router = Router();
authRouter.post("/signup", async (req, res) => {
  const data = createUserSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  const hashedPassword = await bcrypt.hash(data.data.password, saltRounds);
  await prismaClient.user.create({
    data: {
      name: data.data.name,
      password: hashedPassword,
      username: data.data.username,
    },
  });
  res.json({
    message: "user created",
  });
});
authRouter.post("/signin", async (req, res) => {
  const data = signinSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  const user = await prismaClient.user.findUnique({
    where: {
      username: data.data.username,
    },
  });
  if (!user) {
    res.json({
      message: "User doesn't exist",
    });
    return;
  }
  if (!JWT_SECRET) {
    console.log("no jwt secret");
    return;
  }
  const compare = await bcrypt.compare(data.data.password, user.password);
  if (!compare) {
    res.json({
      message: "Invalid creds",
    });
    return;
  }
  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );
  res.json({
    token,
    message: "user signed in",
  });
});
export default authRouter;
