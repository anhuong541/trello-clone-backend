import { Response } from "express";
import config from "../config";

export const sendUserSession = (res: Response, token: string) => {
  res.cookie("user_session", token, {
    httpOnly: true,
    secure: config.env,
    maxAge: 2 * 60 * 60 * 1000, // two day
    path: "/",
  });
};
