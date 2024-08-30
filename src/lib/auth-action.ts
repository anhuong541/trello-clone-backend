import config from "@/config";
import { TaskType } from "@/types";
import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import { readUserIdFromTheCookis } from "./utils";
import { firestoreDB } from "@/db/firebase";
import { doc, getDoc } from "firebase/firestore";
import { checkUserAuthority } from "./firebase-func";

export const sendUserSession = async (res: Response, token: string) => {
  await res.cookie("user_session", token, {
    httpOnly: true, // for deploy only
    secure: config.env,
    maxAge: 2 * 60 * 60 * 1000, // two hours
    path: "/",
  });
};

export const authorizationMidleware = async (req: Request, res: Response, next: NextFunction) => {
  const feat = "check authorization";
  if (config.env) {
    return next();
  }

  const token = req?.cookies.user_session ?? "";
  try {
    jwt.verify(token, config.jwtSecret);
    return next();
  } catch (error) {
    return res.status(401).json({ status: "fail", feat, message: "Un Authorization" });
  }
};

export const checkUserIsAllowJoiningProject = async (userId: string, projectId: string) => {
  return (await getDoc(doc(firestoreDB, `users`, userId, "projects", projectId))).exists();
};

export const authUserIsAMember = async (req: Request<{ projectId: string }, {}, TaskType, {}>, res: Response, next: NextFunction) => {
  const feat = "check user is a member";
  const taskContent = req?.body;
  let projectId = taskContent?.projectId;
  if (!projectId) {
    // console.log("it trigger here!");
    projectId = req.params?.projectId ?? "";
  }

  const userId = readUserIdFromTheCookis(req) as string;

  try {
    const check = await checkUserIsAllowJoiningProject(userId, projectId);
    if (check) {
      return next();
    }

    return res.status(401).json({
      message: "User is not allow on this room",
      userAuthority: check,
      feat,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Check user auth got something wrong",
      status: "fail",
      feat,
    });
  }
};

export const authUserIsProjectOwner = async (req: Request<{ projectId: string }>, res: Response, next: NextFunction) => {
  const feat = "check user is a project owner";
  const projectId = req.params.projectId;
  const userId = readUserIdFromTheCookis(req) as string;

  try {
    const { authority } = await checkUserAuthority(projectId, userId);

    if (authority.includes("Owner")) {
      return next();
    }

    return res.status(401).json({
      status: "success",
      message: "User did not have authority of Owner",
      feat,
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      feat,
      message: "Check user auth got something wrong",
    });
  }
};
