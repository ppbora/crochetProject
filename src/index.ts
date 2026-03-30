import "reflect-metadata";
import express from "express";
import connectToDatabase from "./db/connection-Mongo.ts";
import authRoutes from "./routes/auth-routes.ts"
import env from "./config/config-env.ts";

const app = express();

//DB and PORT
connectToDatabase();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working...");
});

app.use(authRoutes);

app.listen(env.PORT, ()=> {
            console.log(`Server is running on ${env.PORT}`)
        })