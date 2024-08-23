import { Request, Response } from "express";

export default function EditMemberHandler(req: Request, res: Response) {
  return res.status(200).json({ status: "success" });
}
