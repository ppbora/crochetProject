import bcrypt from "bcrypt"
import type { NextFunction, Request, Response } from "express"

export const hashPasswordMW= async (req:Request, res:Response, next: NextFunction)=>{    
    const {password} = req.body;

    if (!password) {
        return res.status(400).send({Error: "Password is required"});
    }

    try{
        const saltRounds=12;
        req.body.password = await bcrypt.hash(password, saltRounds);
        next();
    } catch(err){
        res.status(500).send({Error: "Server Error"})
    }
}