import '../strategies/google-strategy.ts'
import '../strategies/discord-strategy.ts'

import {Router} from "express";
import { checkSchema } from "express-validator";
import passport from "passport";

import { loginSchema } from "../utils/validation-schemas.ts";
import { login, register,refreshToken,redirectOAUTH2,logout } from '../services/auth-service.ts'; 
import errorCheckerMiddleware from "../middleware/error-handler.ts";

const router=Router();

router.post("/api/auth/login", checkSchema(loginSchema), errorCheckerMiddleware, login);

router.get('/api/auth/discord', passport.authenticate("discord"));
router.get('/api/auth/discord/redirect', passport.authenticate("discord", {failureRedirect: '/api/auth/login'}), redirectOAUTH2);

router.get('/api/auth/google', passport.authenticate("google"));
router.get('/api/auth/google/redirect', passport.authenticate("google", {failureRedirect: '/api/auth/login'}), redirectOAUTH2);

router.post("/api/auth/register", checkSchema(loginSchema),errorCheckerMiddleware, register)

router.post("/api/auth/logout", logout);

router.post("/api/auth/refresh", refreshToken);


export default router;