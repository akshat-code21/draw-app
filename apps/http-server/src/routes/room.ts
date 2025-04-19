import { Router } from "express";
import authMiddleware from "../middlewares";
import { createRoomSchema } from "@repo/common/types";
const roomRouter: Router = Router();
roomRouter.use(authMiddleware);
roomRouter.get("/", (req, res) => {
  const data = createRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  res.json({
    roomId: "1213123",
  });
});
export default roomRouter;
