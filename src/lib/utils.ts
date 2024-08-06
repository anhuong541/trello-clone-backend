import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { checkJWTTokenExpire } from "./firebase-func";
dotenv.config();

export const generateNewUid = () => {
  return uuidv4();
};

export const generateUidByString = (inputString: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(inputString);
  const uid = hash.digest("hex");
  return uid.slice(0, 35);
};

const decodeJwt = (token: string) => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT format");
  }

  const payload = parts[1];
  const decodedPayload = JSON.parse(atob(payload));
  return decodedPayload;
};

export const isJwtExpired = async (token: string) => {
  try {
    if (await checkJWTTokenExpire(token)) {
      return true;
    }

    const decoded = decodeJwt(token);
    const exp = decoded.exp;

    if (!exp) {
      throw new Error("No expiration claim found");
    }
    const expirationTime = exp * 1000;
    const currentTime = Date.now();

    return currentTime > expirationTime;
  } catch (error) {
    console.error("Error checking JWT expiration:", error);
    return true;
  }
};
