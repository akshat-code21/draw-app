import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
const wss = new WebSocketServer({ port: 8080 });
interface User {
  ws: WebSocket;
  rooms: number[];
  userId: string;
}
const users: User[] = [];
const checkUser = async (token: string): Promise<string | null> => {
  try {
    try {
      const decoded = jwt.verify(token, JWT_SECRET as string);
      if (decoded && (decoded as JwtPayload).userId) {
        return (decoded as JwtPayload).userId;
      }
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
    }

    const session = await prismaClient.session.findUnique({
      where: {
        token: token,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return null;
    }

    if (session.expiresAt < new Date()) {
      return null;
    }

    return session.userId;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};
wss.on("connection", async (ws, req) => {
  const url = req.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  const userId = await checkUser(token as string);
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
    try {
      const parsedData = JSON.parse(data as string);
      
      if (parsedData.type === "delete_all_shapes") {
        const roomId = parsedData.roomId;
        await prismaClient.chat.deleteMany({
          where: {
            roomId,
          },
        });
        
        users.forEach((user) => {
          if (user.rooms.includes(roomId) && user.ws !== ws) {
            user.ws.send(
              JSON.stringify({
                type: "delete_all_shapes",
                roomId,
              })
            );
          }
        });
      }
      
      if (parsedData.type === "join_room") {
        const user = users.find((x) => x.ws === ws);
        if (user) {
          user.rooms.push(parsedData.roomId);
        }
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
            if (user.rooms.includes(roomId) && user.ws !== ws) {
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
          ws.send(JSON.stringify({
            type: "error",
            message: "Failed to save message to database"
          }));
        }
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
      console.error("Raw data:", data);
    }
  });

  ws.on("close", () => {
    const userIndex = users.findIndex((user) => user.ws === ws);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
    }
  });
});
