import { Router } from "express";
import authMiddleware from "../middlewares";
import { createRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
const roomRouter: Router = Router();
roomRouter.use(authMiddleware);
roomRouter.get("/", async (req, res) => {
  const data = createRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  const userId = req.userId;
  await prismaClient.room.create({
    data: {
      slug: data.data.name,
      adminId: userId as string,
    },
  });
  res.json({
    roomId: "1213123",
  });
});
export default roomRouter;
