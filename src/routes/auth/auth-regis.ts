import {Router} from "express";
import UserModel from "../../db/schemas/users-schemas.ts";
import { hashPasswordMW } from "../../utils/hash-password.ts";

const router = Router();

router.post("/api/auth/register",hashPasswordMW, async(req,res)=>{
    const {name, username, password, gender} = req.body
    try{
        const findUser = await UserModel.findOne({username: username});
        
        if(!findUser) {
            const newUser = new UserModel({name, username,password,gender});
            const saveUser = await newUser.save();
            return res.status(200).send(`User: ${saveUser.username}`);
        } else {
            return res.status(400).send({error: "Username is already existed."});
        }
    } catch(err){
        res.status(400).send({error: "Error while saving user"});
    }
} );

export default router;