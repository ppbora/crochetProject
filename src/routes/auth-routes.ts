import {Router} from "express";
import loginRoute from "./auth/auth-login.ts";
import regisRoute from "./auth/auth-regis.ts";
import refreshRoute from "./auth/auth-refresh.ts";
import logoutRoute from "./auth/auth-logout.ts"

const router=Router();

router.use(loginRoute);
router.use(regisRoute);
router.use(refreshRoute);
router.use(logoutRoute);


export default router;