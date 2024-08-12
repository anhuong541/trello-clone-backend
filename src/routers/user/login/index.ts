import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { generateUidByString, isJwtExpired } from "../../../lib/utils";
import {
  checkEmailUIDExists,
  getUserDataById,
} from "../../../lib/firebase-func";
import config from "../../../config";

export default async function LoginRouteHandler(req: Request, res: Response) {
  const feat = "login";
  const { email, password } = req.body;
  const jwtToken = req.headers["authorization"]?.split(" ")[1] ?? "";

  // update one more logic is when email and password input is empty and jwt is exists then go to another case
  // we need to check the middleware auto login case
  // some trouble with jwt authenticaltion logic flow
  // do it later

  if (!email || !password) {
    return res.status(500).json({
      status: "fail",
      message: "require email and password !!!",
      feat,
    });
  }

  const uid = generateUidByString(email);
  const checkEmail = await checkEmailUIDExists(uid);

  if (!checkEmail) {
    return res
      .status(409)
      .json({ status: "fail", error: "email doesn't exists!", feat });
  }

  let token = jwtToken;

  if (!jwtToken || jwtToken === "") {
    const userJwtToken = (await getUserDataById(uid)) ?? { jwtToken: "" }; // checked user is exists
    token = userJwtToken.jwtToken;
  }

  let jwtChanged = false;

  if (await isJwtExpired(token)) {
    token = jwt.sign({ email, password }, config.jwtSecret, {
      expiresIn: "1d",
    });
    jwtChanged = true;
  }

  const verifyToken = jwt.verify(token, config.jwtSecret);

  console.log({ verifyToken });

  return res
    .status(200)
    .json({ status: "success", token, feat, jwtChanged, userId: uid });
}
