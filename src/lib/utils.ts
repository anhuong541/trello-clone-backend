import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { Response } from "express";
import { checkEmailUIDExists, checkProjectExists } from "./firebase-func";

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
