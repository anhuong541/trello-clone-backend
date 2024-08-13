import { generateUidByString } from "../../../lib/utils";
import { checkEmailUIDExists } from "../../../lib/firebase-func";
import { Request, Response } from "express";

export default async function CheckEmailIsValidRouteHandler(
  req: Request,
  res: Response
) {
  const feat = "check email";
  const { email } = req.body;
  if (!email) {
    res
      .status(500)
      .json({ status: "fail", message: "email is require!!!", feat });
  }

  const userId = generateUidByString(email);
  const checkEmail = await checkEmailUIDExists(userId);

  if (checkEmail) {
    return res.status(200).json({
      status: "fail",
      message: "Email have been used",
      feat,
      used: true,
    });
  } else {
    return res.status(200).json({
      status: "success",
      message: "You can use this email",
      feat,
      used: false,
    });
  }
}
