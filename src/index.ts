import "reflect-metadata";
import express from "express";
import connectToDatabase from "./db/connection-Mongo.ts";
import authRoutes from "./routes/auth-routes.ts"
import env from "./config/config-env.ts";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import {serializeUser, deserializeUser} from "./strategies/serialization.ts"

const app = express();

//DB and PORT
connectToDatabase();

app.use(express.json());
app.use(cookieParser())
app.use(session({
    secret: env.ACCESS_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 30 
    }
}));

app.use(passport.initialize()) //Adds Passport functionality to req
app.use(passport.session()) //connects Passport to sessions

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.get("/", (req, res) => {
  res.send("API is working...");
});

app.use(authRoutes);

app.listen(env.PORT, ()=> {
  console.log(`Server is running on ${env.PORT}`)
})