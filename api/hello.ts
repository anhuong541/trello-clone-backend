import { Request, Response } from "express";

module.exports = (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello from the backend!" });
};
