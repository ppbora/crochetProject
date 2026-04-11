import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type {
  MyTokenPayload,
  VerifyErrors,
  Jwt,
  JwtPayload,
} from "jsonwebtoken";
import env from "../config/config-env.ts";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies["authToken"];
  if (!token) {
    return res.status(401).send({ error: "Access Denied. No token provided." });
  }
  jwt.verify(
    token,
    env.ACCESS_SECRET_KEY,
    (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err || !decoded) {
        res.status(401).send({ error: "Invalid or expired token." });
        return;
      }
      const payload = decoded as MyTokenPayload;
      req.user = {
        id: payload.id,
        username: payload.username,
      };
      next();
    },
  );
};
