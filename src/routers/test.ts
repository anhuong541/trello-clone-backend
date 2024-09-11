import { Request, Response } from "express";
export default async function TesttingRouteHandler(req: Request, res: Response) {
  return res.status(200).send({ text: "testing api" });
}
