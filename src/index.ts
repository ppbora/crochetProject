import express from "express";
import connectToDatabase from "./db/connection-Mongo.ts";
import cookieParser from "cookie-parser";
import env from "./config/config-env.ts"

const app = express();

//DB and PORT
connectToDatabase();

app.use(express.json());
app.use(cookieParser("secret"));


app.get("/", (req, res) => {
  res.send("API is working ....");
});

//app.use("/api", authRoutes);