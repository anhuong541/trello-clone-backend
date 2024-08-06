import { Request, Response } from "express";
import { generateUidByString } from "../../../lib/utils";
import { checkEmailUIDExists } from "../../../lib/firebase-func";

export default async function CheckEmailIsValidRouteHandler(
  req: Request,
  res: Response
) {
  const { email } = req.body;
  if (!email) {
    res.status(500);
    throw Error("require email!!!");
  }

  const uid = generateUidByString(email);
  const checkEmail = await checkEmailUIDExists(uid);

  if (checkEmail) {
    return res
      .status(409)
      .json({ status: "fail", error: "email have been used!" });
  } else {
    return res
      .status(200)
      .json({ status: "success", error: "email haven't been used!" });
  }
}
