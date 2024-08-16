import { Response } from "express";
import config from "../config";

export const sendUserSession = (res: Response, token: string) => {
  console.log({ token, env: config.env });
  const data = res.cookie("user_session", token, {
    httpOnly: true,
    secure: config.env,
    maxAge: 2 * 60 * 60 * 1000, // two hours
    path: "/",
  });

  console.log({ data });
};
