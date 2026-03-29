import {Router} from "express";
import loginRoute from "./auth/auth-login.ts"

const router=Router();

router.use(loginRoute);

export default router;