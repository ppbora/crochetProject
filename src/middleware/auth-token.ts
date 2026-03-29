import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../config/config-env.ts";

export const authenticateToken = (req:Request, res:Response, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Bearer <token>

    if (token == null) return res.sendStatus(401);  // No token present

    jwt.verify(token, env.ACCESS_SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);  // Invalid token

        req.user = user;
        next();
    });
};