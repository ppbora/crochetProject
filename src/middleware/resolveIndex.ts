import { Request } from "express";
import { name } from "../utils/constants";
interface CustomRequest extends Request {
  findIndex: number;
}


export const resolveIndex = (req:CustomRequest, res, next) => {
    const {params: {id}} = req;
    const parsedID = parseInt(String(id));

    if (isNaN(parsedID)) return res.status(400).send({ msg: 'Bad Request: Invalid ID' });
    const findIndex = name.findIndex((use)=> use.id === parsedID);

    if (findIndex === -1) return res.sendStatus(404);
    
    req.findIndex = findIndex;
    next();
}