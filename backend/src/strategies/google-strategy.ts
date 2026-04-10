import passport from "passport";
import {Strategy} from 'passport-google-oauth20';
import env from "../config/config-env.ts";
import { loginGoogle } from "../services/strategies.ts";
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;

passport.use(
    new Strategy ({
        clientID: '719281420110-5lan736s3j7eqdkm35ebt3c61du3kamn.apps.googleusercontent.com',
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/auth/google/redirect',
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
        scope:['profile','email'] 
    }, loginGoogle)
)