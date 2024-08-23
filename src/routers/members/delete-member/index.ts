import { Request, Response } from "express";

export default function DeleteMemberHandler(req: Request, res: Response) {
  return res.status(200).json({ status: "success" });
}
