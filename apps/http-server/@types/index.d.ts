declare namespace Express {
  interface Request {
    userId?: string | number;
  }
  interface JwtPayload{
    userId?: string | number;
  }
}
