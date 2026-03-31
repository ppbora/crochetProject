import {Router, type Request, type Response} from "express";
import { loginSchema } from "../../utils/validation-schemas.ts";
import { checkSchema, validationResult } from "express-validator";
import {login} from "../../utils/login-function.ts"

const router=Router();

router.post("/api/auth/login", checkSchema(loginSchema), login, async(req:Request,res:Response)=>{
    const errors = validationResult(req);
    
    if(!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    try {
        await login(req,res);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
