import { type Request, type Response } from "express"
import jwt from "jsonwebtoken";
import UserModel from "../db/schemas/users-schemas.ts"
import bcrypt from 'bcrypt';
import env from "../config/config-env.ts";

const ACCESS_SECRET_KEY=env.ACCESS_SECRET_KEY;
const REFRESH_SECRET_KEY=env.REFRESH_SECRET_KEY;

export const login = async (req: Request, res: Response ) =>{
    const { username, password } = req.body;
    const findUser = await UserModel.findOne({username});

    if(!findUser) return res.status(401).send({error: "Invalid username or password"});
    const matchPassword = await bcrypt.compare(password, findUser.password);

    if (matchPassword) {
        const accessToken = jwt.sign({ username }, ACCESS_SECRET_KEY, { expiresIn: '30m' });
        const refreshToken = jwt.sign({ username }, REFRESH_SECRET_KEY, { expiresIn: '30d' });
        findUser.refreshToken = refreshToken;
        await findUser.save();

        res.cookie('refreshToken', refreshToken,{
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
        })

        return res.status(200).send({ 
            message: "Login successful!",
            accessToken: accessToken
        });
    } else{
            return res.status(401).json({ error: "Invalid username or password" });
    }
};