import { Router } from "express";
import authMiddleware from "../middlewares";
import { createRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
const roomRouter: Router = Router();
roomRouter.use(authMiddleware);
/**
 * @swagger
 * /api/room/create-room:
 *   post:
 *     summary: Create a new room
 *     description: Creates a new room with the provided name
 *     responses:
 *       200:
 *         description: Room created successfully
 *       400:
 *         description: Invalid inputs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     security:
 *       - bearerAuth: []
  */
roomRouter.post("/create-room", async (req, res) => {
  const data = createRoomSchema.safeParse(req.body);
  console.log(data);
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
    console.log(error);
    res.json({
      message: error,
    });
  }
});

/**
 * @swagger
 * /api/room/get-rooms:
 *   get:
 *     summary: Get all rooms
 *     description: Retrieves all rooms
 *     responses:
 *       200:
 *         description: Rooms retrieved successfully
 *       400:
 *         description: Invalid inputs
 *     security:
 *       - bearerAuth: []
 */
roomRouter.get("/get-rooms", async (req, res) => {
  try {
    const userId = req.userId;
    const rooms = await prismaClient.room.findMany({
      where: {
        adminId: userId as string,
      },
    });
    if (!rooms) {
      res.json({
        message: "No rooms found",
      });
      return;
    }
    res.json({
      rooms,
    });
  } catch (error) {
    res.json({
      message: "Error fetching rooms",
    });
  }
});

/**
 * @swagger
 * /api/room/{slug}:
 *   get:
 *     summary: Get a room by slug
 *     description: Retrieves a room by its slug
 *     responses:
 *       200:
 *         description: Room retrieved successfully
 *       400:
 *         description: Invalid inputs
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
*/
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
