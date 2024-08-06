import { Request, Response } from "express";
import { addJWTTokenExpire } from "../../../lib/firebase-func";

export default async function LogoutRouteHandler(req: Request, res: Response) {
  const { jwtToken } = req.body;
  if (!jwtToken) {
    return res.status(404).json({ status: "fail", feat: "already logout" });
  }

  try {
    await addJWTTokenExpire(jwtToken);
    return res.status(200).json({ status: "success", feat: "logout" });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      text: "something wong to the server",
      feat: "logout",
      error,
    });
  }
}
