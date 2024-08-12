import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../../config";

export default async function TokenVerifyHandler(req: Request, res: Response) {
  const feat = "token verify";
  const jwtToken = req.headers["authorization"]?.split(" ")[1] ?? "";

  try {
    const checkJwt = jwt.verify(jwtToken, config.jwtSecret) as any;
    return res.status(200).json({ status: "success", feat, checkJwt });
  } catch (error) {
    return res
      .status(401)
      .json({ status: "error", feat, message: "token is expire" });
  }
}
