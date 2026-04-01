import '../../strategies/discord-strategy.ts'
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import env from '../../config/config-env.ts';

const ACCESS_SECRET_KEY=env.ACCESS_SECRET_KEY;
const REFRESH_SECRET_KEY=env.REFRESH_SECRET_KEY;
const router = Router();

router.get('/api/auth/discord', passport.authenticate("discord"));
router.get('/api/auth/discord/redirect', passport.authenticate("discord"), (req, res)=>{
    try{
        const username = req.user
        const accessToken = jwt.sign({ username: username }, ACCESS_SECRET_KEY, { expiresIn: '30m' });
        const refreshToken = jwt.sign({ uหername: username }, REFRESH_SECRET_KEY, { expiresIn: '30d' });
        if (refreshToken) {
            res.cookie('refreshToken', refreshToken,{
                httpOnly: true, 
                secure: process.env.NODE_ENV === "production",
                maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
            })
        }
        return res.status(200).send({ 
                message: "Login successful!",
                accessToken: accessToken
        });
    } catch(err){
        console.error("Login Server Error: ", err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router