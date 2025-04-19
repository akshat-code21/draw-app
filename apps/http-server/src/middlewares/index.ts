import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const headers = req.headers["authorization"];
  const token = headers?.split(" ")[1];
  const decoded = jwt.verify(
    token as string,
    JWT_SECRET as string
  ) as JwtPayload;
  if (!decoded) {
    res.json({
      message: "JWT error",
    });
    return;
  }
  req.userId = decoded.userId;
  next();
}
