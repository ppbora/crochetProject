import type { Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/config-env.ts";
import type {AuthRequest} from "../types/user.ts"

export const authenticateToken = (req:AuthRequest, res:Response, next:NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Bearer <token>

    if (!token) {
            return res.status(401).send({ error: "Access Denied. No token provided." });
    }
    
    jwt.verify(token, env.ACCESS_SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);  // Invalid token

        req.user = user as { username: string }; 
        next();
    });
};