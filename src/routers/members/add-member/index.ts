import { Request, Response } from "express";

export default function AddMemberHandler(req: Request, res: Response) {
  return res.status(200).json({ status: "success" });
}
