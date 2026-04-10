import type { Request, Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { MyTokenPayload } from "jsonwebtoken";
import env from "../config/config-env.ts";

export const authenticateToken = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Bearer <token>
    if (!token) {
        return res.status(401).send({ error: "Access Denied. No token provided." });
    }
    jwt.verify(token, env.ACCESS_SECRET_KEY, (err, decoded) => {
        const payload = decoded as MyTokenPayload;

        if (err || !decoded) 
            return res.status(401).send({ error: "Invalid or expired token." });
        req.user = {
            id: payload.id,
            username: payload.username
        };
        next();
    });
};