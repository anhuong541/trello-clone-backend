import { Request, Response } from "express";
import { generateUidByString } from "../../lib/utils";
import { checkEmailUIDExists } from "../../lib/firebase-func";

export default async function LoginRouteHandler(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email && !password) {
    res.status(500);
    throw Error("require email and password !!!");
  }

  const uid = generateUidByString(email);
  const checkEmail = await checkEmailUIDExists(uid);

  if (checkEmail) {
    return res
      .status(409)
      .json({ status: "fail", error: "email doesn't exists!" });
  }

  return res.status(200).json({ status: "success", jwt: "", feat: "login" });
}
