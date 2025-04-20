import { Router } from "express";
import authMiddleware from "../middlewares";
import { createRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
const   roomRouter: Router = Router();
// roomRouter.use(authMiddleware);
roomRouter.post("/create-room", async (req, res) => {
  const data = createRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  const userId = req.userId;
  try {
    const room = await prismaClient.room.create({
      data: {
        slug: data.data.name,
        adminId: userId as string,
      },
    });
    res.json({
      roomId: room.id,
    });
  } catch (error) {
    res.json({
      message: "Room already exists.",
    });
  }
});
roomRouter.get("/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
  });
  res.json({
    roomId: room?.id,
  });
});
export default roomRouter;
