import {Router} from "express";
import { authenticateToken } from "../../middleware/auth-token.ts";
import UserModel from "../../db/schemas/users-schemas.ts";

const router=Router();

router.post("/api/auth/logout", authenticateToken, async (req,res)=>{
    if(req.cookies.refreshToken == undefined) return res.status(204).send({msg: "already logged out"})
    try{
        await UserModel.findOneAndUpdate(
                { refreshToken: req.cookies?.refreshToken }, 
                { refreshToken: "" });
        res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"
        });
        res.clearCookie('accessToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"
        });
        return res.status(200).send({
            msg: "logout successful",
            accessToken: req.cookies.accessToken
        })
    }catch(err){
        return res.status(500).send({error: "server error"})
    }
});

export default router;