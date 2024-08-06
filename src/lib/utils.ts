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

export const decodeJWT = (
  token: string
): { header: any; payload: any; signature: string } | null => {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    console.error("Invalid JWT token");
    return null;
  }

  const [headerB64, payloadB64, signature] = token.split(".");

  try {
    const decodeBase64Url = (str: string): any => {
      const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      const padding = "=".repeat((4 - (base64.length % 4)) % 4);
      const base64WithPadding = base64 + padding;
      const decodedStr = Buffer.from(base64WithPadding, "base64").toString(
        "utf8"
      );
      return JSON.parse(decodedStr);
    };
    const header = decodeBase64Url(headerB64);
    const payload = decodeBase64Url(payloadB64);

    return { header, payload, signature };
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};
