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

export const checkUIDAndProjectExists = async (userId: string, projectId: string, feat: string, res: Response) => {
  if (!(await checkEmailUIDExists(userId))) {
    return res.status(409).json({ status: "fail", error: "user doesn't exists!", feat });
  }

  if (!(await checkProjectExists(projectId))) {
    return res.status(409).json({ status: "fail", error: "project doesn't exists!", feat });
  }

  return null;
};

export const readUserIdFromTheCookis = (req: Request) => {
  if (config.env) {
    return readUserIdFromAuth(req); // only for deploy
  }
  const token = req?.cookies.user_session ?? "";
  const { email } = jwt.verify(token, config.jwtSecret) as { email: string };
  return generateUidByString(email);
};

export const readUserIdFromAuth = (req: Request) => {
  const token = req?.headers?.authorization.split(" ")[1] ?? ""; // send at the client
  const { email } = jwt.verify(token, config.jwtSecret) as { email: string };
  return generateUidByString(email);
};

export const handleFormatDataBoard = (data) => {
  const dataLength = data.length;
  const createKanbanMap = new Map();
  data.forEach((item) => {
    const value = createKanbanMap.get(item.taskStatus) ?? [];
    createKanbanMap.set(item.taskStatus, [...value, item]);
  });

  let dataBoard;
  if (dataLength > 0) {
    dataBoard = {
      Open: {
        label: "Open",
        table: createKanbanMap.get("Open") ?? [],
      },
      "In-progress": {
        label: "In-progress",
        table: createKanbanMap.get("In-progress") ?? [],
      },
      Resolved: {
        label: "Resolved",
        table: createKanbanMap.get("Resolved") ?? [],
      },
      Closed: {
        label: "Closed",
        table: createKanbanMap.get("Closed") ?? [],
      },
    };
  } else {
    dataBoard = {
      Open: {
        label: "Open",
        table: [],
      },
      "In-progress": {
        label: "In-progress",
        table: [],
      },
      Resolved: {
        label: "Resolved",
        table: [],
      },
      Closed: {
        label: "Closed",
        table: [],
      },
    };
  }

  createKanbanMap.clear();

  return {
    dataBoard,
    dataLength,
  };
};
