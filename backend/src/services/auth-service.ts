import type { NextFunction, Request, Response } from "express";
import UserModel from "../db/schemas/users-schemas.ts";
import jwt from "jsonwebtoken";
import env from "../config/config-env.ts";
import bcrypt from "bcrypt";
import { hashPassword } from "../utils/hash-password.ts";
import { saveUserLocal } from "../db/users.ts";

const ACCESS_SECRET_KEY = env.ACCESS_SECRET_KEY;
const REFRESH_SECRET_KEY = env.REFRESH_SECRET_KEY;

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const findUser = await UserModel.findOne({ username }).select("+password"); // select to display password

  if (!findUser || !findUser.password)
    return res.status(401).send({ error: "Invalid username or password" });
  const matchPassword = await bcrypt.compare(password, findUser.password);

  if (matchPassword) {
    const accessToken = jwt.sign({ username }, ACCESS_SECRET_KEY, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign({ username }, REFRESH_SECRET_KEY, {
      expiresIn: "30d",
    });
    findUser.refreshToken = refreshToken;
    await findUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    });

    res.cookie("authToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 60 * 1000, //30 mins
    });

    return res.status(200).send({
      message: "Login successful!",
      accessToken: accessToken,
    });
  } else {
    return res.status(401).json({ error: "Invalid username or password" });
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, username, password, gender } = req.body;

  // vaildate password
  if (!password) {
    return res.status(400).send({ Error: "Password is required" });
  }

  // hash
  const hashedPassword = await hashPassword(password);

  // saved to DB
  try {
    await saveUserLocal(name, username, hashedPassword, gender);
  } catch (err) {
    return res.status(500).send({ error: "Please check" });
  }

  res.status(201).send(`${username} has been registered`);
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = req?.user?.id ?? "Unknown User";
    if (!currentUserId) return res.sendStatus(403);
    if (currentUserId.toString !== id?.toString) return res.sendStatus(400);
    const user = await UserModel.findById(req.params.id).select(
      "username name gender -_id",
    );
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const currentRefreshToken = req.cookies?.refreshToken;
    if (!currentRefreshToken)
      return res
        .status(401)
        .send({ Error: "FAILED AT STEP 2: No token found" });

    const decoded = jwt.verify(currentRefreshToken, REFRESH_SECRET_KEY) as {
      username: string;
    };
    const findUser = await UserModel.findOne({
      username: decoded.username,
      refreshToken: currentRefreshToken,
    });

    console.log("Looking for username:", decoded.username);
    console.log("Looking for token:", currentRefreshToken);
    if (!findUser)
      return res.status(403).send({ Error: "Invalid refresh token" });
    const newAccessToken = jwt.sign(
      { username: findUser.username },
      ACCESS_SECRET_KEY,
      { expiresIn: "30m" },
    );
    const newRefreshToken = jwt.sign(
      { username: findUser.username },
      REFRESH_SECRET_KEY,
      { expiresIn: "30d" },
    );
    findUser.refreshToken = newRefreshToken;
    await findUser.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    });

    return res
      .status(200)
      .send({ msg: "Access token is refreshed", accessToken: newAccessToken });
  } catch (err: any) {
    return res
      .status(403)
      .send({ error: "Token verification crashed", details: err.message });
  }
};

export const redirectOAUTH2 = (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).send({ error: "User not authenticated" });
    }

    const jwtPayload = {
      id: user.id, // Use this for database lookups
      username: user.username, // Use this for frontend display
    };

    const accessToken = jwt.sign(jwtPayload, ACCESS_SECRET_KEY, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(jwtPayload, REFRESH_SECRET_KEY, {
      expiresIn: "30d",
    });
    if (refreshToken) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
      });
    }
    return res.status(200).send({
      message: "Login successful!",
      accessToken: accessToken,
    });
  } catch (err) {
    console.error("Login Server Error: ", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  if (!req.cookies?.refreshToken) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(204).send();
  }
  try {
    await UserModel.findOneAndUpdate(
      { refreshToken: req.cookies?.refreshToken },
      { refreshToken: "" },
    );
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).send({
      msg: "logout successful",
      accessToken: req.cookies.accessToken,
    });
  } catch (err) {
    return res.status(500).send({ error: "server error" });
  }
};
