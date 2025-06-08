import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const headers = req.headers["authorization"];
  const token = headers?.split(" ")[1];
  
  if (!token) {
    res.json({
      message: "No token provided",
    });
    return;
  }

  try {
    // First try to verify as JWT (for backward compatibility with old auth)
    try {
      const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
      if (decoded && decoded.userId) {
        req.userId = decoded.userId;
        next();
        return;
      }
    } catch (jwtError) {
      // If JWT verification fails, try Better Auth session token
    }

    // Try Better Auth session token
    const session = await prismaClient.session.findUnique({
      where: {
        token: token,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      res.json({
        message: "Invalid token",
      });
      return;
    }

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      res.json({
        message: "Session expired",
      });
      return;
    }

    req.userId = session.userId;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.json({
      message: "Authentication error",
    });
  }
}
