import { prismaClient } from "@repo/db/client";
import { Router } from "express";
const chatRouter: Router = Router();
chatRouter.get("/:roomId", async (req, res) => {
  const roomId = parseInt(req.params.roomId);
  const messages = await prismaClient.chat.findMany({
    where: {
      roomId,
    },
    orderBy: {
      id: "desc",
    },
    take: 50,
  });
  res.json({
    messages: messages,
  });
});
export default chatRouter;
