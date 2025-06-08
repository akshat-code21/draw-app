import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
const wss = new WebSocketServer({ port: 8080 });
interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}
const users: User[] = [];
const checkUser = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    if (!decoded || !(decoded as JwtPayload).userId) {
      return null;
    }
    return (decoded as JwtPayload).userId;
  } catch (error) {
    return null;
  }
};
wss.on("connection", (ws, req) => {
  const url = req.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  const userId = checkUser(token as string);
  if (!userId) {
    ws.close();
    return;
  }
  users.push({
    userId: userId,
    rooms: [],
    ws,
  });
  ws.on("message", async (data: string) => {
    const parsedData = JSON.parse(data as string);
    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }
    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) {
        ws.close();
        return;
      }
      user.rooms = user?.rooms.filter((x) => x === parsedData.room);
    }
    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;
      
      try {
        await prismaClient.chat.create({
          data: {
            roomId,
            message,
            userId,
          },
        });
        
        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                message: message,
                roomId,
              })
            );
          }
        });
      } catch (error) {
        console.error("Failed to create chat message:", error);
        // Send error back to client
        ws.send(JSON.stringify({
          type: "error",
          message: "Failed to save message to database"
        }));
      }
    }
  });
});
