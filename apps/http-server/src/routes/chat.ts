import { prismaClient } from "@repo/db/client";
import { Router } from "express";
const chatRouter: Router = Router();
/**
 * @swagger
 * /api/chat/{roomId}:
 *   get:
 *     summary: Get messages for a room
 *     description: Retrieves the last 50 messages for a specific room
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       400:
 *         description: Invalid inputs
 *     security:
 *       - bearerAuth: []
*/
chatRouter.get("/:roomId", async (req, res) => {
  const roomId = parseInt(req.params.roomId);
  const messages = await prismaClient.chat.findMany({
    where: {
      roomId,
    },
    orderBy: {
      id: "asc",
    },
    take: 50,
  });
  res.json({
    messages: messages,
  });
});
export default chatRouter;
