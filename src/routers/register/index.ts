import { Request, Response } from "express";
import { firebaseDB } from "../../db/firebase";

export default async function RegisterRouteHandler(
  req: Request,
  res: Response
) {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    res.status(500);
    throw Error("require email and password !!!");
  }

  // var ref = firebaseDB.ref("users/uVZBH2tP5yGIhgfJ128n");
  // ref.once("value", function (snapshot) {
  //   console.log(snapshot.val());
  // });

  const reff = firebaseDB.ref("users");
  // reff.once("value", (snapshot) => {
  //   console.log(snapshot.val());
  // });

  reff.push("value");

  // console.log({ reff });

  return res.status(200).json({ status: "register" });
}
