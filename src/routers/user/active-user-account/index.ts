import { Request, Response } from "express";
import {
  createNewUser,
  deleteAccountUnActive,
  getUserDataById,
} from "@/lib/firebase-func";
import { generateUidByString } from "@/lib/utils";
import { DataRegister } from "@/types/firebase";
import jwt from "jsonwebtoken";
import config from "@/config";

export default async function ActiveUserAccountHandler(
  req: Request<{ email: string; hash: string }, {}, {}, {}>,
  res: Response
) {
  const { email, hash } = req.params;

  const userId = generateUidByString(email);
  const data = await getUserDataById(userId);

  if (data?.isActive) {
    return res.redirect("http://localhost:3000/project");
  }

  try {
    await jwt.verify(data?.activationHash, config.jwtSecret);
  } catch (error) {
    await deleteAccountUnActive(userId);
    return res.status(200).json({
      message: "email active is expired! Please register your email again!",
    });
  }

  if (data?.activationHash !== hash) {
    await deleteAccountUnActive(userId);
    return res.status(200).json({
      message:
        "your something wrong when active your email please register with this email again!",
    });
  }

  const removeHashData: DataRegister = {
    uid: data.uid,
    username: data.username,
    email: data.email,
    password: data.password,
    createAt: data.createAt,
    activationHash: null,
    isActive: true,
  };

  await createNewUser(userId, removeHashData); // update to remove hash active
  return res.redirect("http://localhost:3000/project");
}
