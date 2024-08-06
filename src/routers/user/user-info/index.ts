import { Request, Response } from "express";
import { decodeJWT, generateUidByString } from "../../../lib/utils";
import { getUserDataById } from "../../../lib/firebase-func";

export default async function TakeUserInfoHandler(req: Request, res: Response) {
  const { jwtToken } = req.body;
  if (jwtToken) {
    return res
      .status(500)
      .json({ status: "fail", message: "can't find jwt after login !!!" });
    // throw Error("can't find jwt after login !!!");
  }

  const decode: { header: any; payload: any; signature: string } | null =
    await decodeJWT(jwtToken);

  if (!decode) {
    return res
      .status(500)
      .json({ status: "fail", message: "something wrong with jwt !!!" });
  }

  const { payload } = decode;

  const uid = generateUidByString(payload.email);
  const data = await getUserDataById(uid);

  return res
    .status(200)
    .json({ status: "success", message: "get user data success", data });
}
