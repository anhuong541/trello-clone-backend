import { Request, Response } from "express";

export default async function ActiveUserAccountHandler(
  req: Request,
  res: Response
) {
  return res.status(200).json({ message: "it run!!!" });
}
