import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Request, Response } from "express";
import { checkEmailUIDExists, checkProjectExists } from "./firebase-func";
import config from "../config";

export const generateNewUid = () => {
  return uuidv4();
};

export const generateUidByString = (inputString: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(inputString);
  const uid = hash.digest("hex");
  return uid.slice(0, 35);
};

export const checkUIDAndProjectExists = async (
  userId: string,
  projectId: string,
  feat: string,
  res: Response
) => {
  if (!(await checkEmailUIDExists(userId))) {
    return res
      .status(409)
      .json({ status: "fail", error: "user doesn't exists!", feat });
  }

  if (!(await checkProjectExists(userId, projectId))) {
    return res
      .status(409)
      .json({ status: "fail", error: "project doesn't exists!", feat });
  }

  return null;
};

export const readUserIdFromTheCookis = (req: Request) => {
  // const token = req?.headers.authorization?.split(" ")[1] ?? ""; // send at the server
  const token = req?.cookies.user_session ?? ""; // send at the client
  console.log("read cookie", { token });
  const { email } = jwt.verify(token, config.jwtSecret) as { email: string };
  return generateUidByString(email);
};

// const token = req?.headers.authorization?.split(" ")[1] ?? "";
// let verifedToken: any = "";
// try {
//   verifedToken = jwt.verify(token, config.jwtSecret);
// } catch (error) {
//   return res.status(401).json({ status: "fail", feat });
// }
// const userId = generateUidByString(verifedToken.email);
// try {
//   const data = await getUserDataById(userId);
//   return res.status(200).json({
//     status: "success",
//     message: "get user data success",
//     feat,
//     data,
//   });
// } catch (error) {
//   return res.status(404).json({
//     status: "fail",
//     message: "missing userId or something",
//     feat,
//     error,
//   });
// }
