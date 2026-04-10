import passport from "passport";
import {Strategy} from 'passport-discord';
import env from "../config/config-env.ts";
import { loginDiscord } from "../services/strategies.ts";

const DISCORD_CLIENT_SECRET = env.DISCORD_CLIENT_SECRET;

passport.use(
    new Strategy ({
        clientID: '1488774066725978262',
        clientSecret: DISCORD_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/auth/discord/redirect',
        scope:["identify"] 
    }, loginDiscord 
    )
)