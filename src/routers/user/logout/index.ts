import { Request, Response } from "express";
import { addJWTTokenExpire } from "../../../lib/firebase-func";

export default async function LogoutRouteHandler(req: Request, res: Response) {
  const feat = "logout";
  const { jwtToken } = req.body;
  if (!jwtToken) {
    return res.status(404).json({ status: "fail", feat });
  }

  try {
    await addJWTTokenExpire(jwtToken);
    return res.status(200).json({ status: "success", feat });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      text: "something wong to the server",
      feat,
      error,
    });
  }
}
