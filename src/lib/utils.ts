const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
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
};

export const readUserIdFromTheCookis = (
  req: Request,
  res: Response,
  feat: string
) => {
  const token = req?.cookies.user_session ?? "";
  try {
    const { email } = jwt.verify(token, config.jwtSecret) as { email: string };
    return generateUidByString(email);
  } catch (error) {
    return res
      .status(401)
      .json({ status: "fail", feat, message: "Un Authorization" });
  }
};
