import {Router} from "express";
import loginRoute from "./auth/auth-login.ts";
import regisRoute from "./auth/auth-regis.ts"

const router=Router();

router.use(loginRoute);
router.use(regisRoute);

export default router;