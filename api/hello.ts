import { Request, Response } from "express";

export default function apiHandler(req: Request, res: Response) {
  res.status(200).json({ status: "success", data: "it run!!!" });
}
