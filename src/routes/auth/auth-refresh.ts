import {Router} from "express";
import UserModel from "../../db/schemas/users-schemas.ts";
import jwt from "jsonwebtoken";
import env from "../../config/config-env.ts";
import { error } from "node:console";

const ACCESS_SECRET_KEY=env.ACCESS_SECRET_KEY;
const REFRESH_SECRET_KEY=env.REFRESH_SECRET_KEY
const router=Router();

router.post("/api/auth/refresh", async (req,res)=>{
    try{
        const currentRefreshToken = req.cookies?.refreshToken;
        if (!currentRefreshToken)
            return res.status(401).send({Error: "FAILED AT STEP 2: No token found"});

        const decoded = jwt.verify(currentRefreshToken, REFRESH_SECRET_KEY) as { username: string };
        const findUser = await UserModel.findOne({
            username: decoded.username
            , refreshToken: currentRefreshToken});
        
        console.log("Looking for username:", decoded.username);
        console.log("Looking for token:", currentRefreshToken);
        if(!findUser) 
            return res.status(403).send({Error: "Invalid refresh token"});
        const newAccessToken = jwt.sign({ username: findUser.username }, ACCESS_SECRET_KEY, { expiresIn: '30m' });
        const newRefreshToken = jwt.sign({username: findUser.username}, REFRESH_SECRET_KEY, { expiresIn: '30d' });
        findUser.refreshToken=newRefreshToken;
        await findUser.save();

        res.cookie('refreshToken', newRefreshToken,{
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
        })

        return res.status(200).send({msg: 'Access token is refreshed', accessToken: newAccessToken})
    }catch(err:any){
        return res.status(403).send({ error: "Token verification crashed", details: err.message});
    }
});

export default router;