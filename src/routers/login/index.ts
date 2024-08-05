import { Request, Response } from "express";
import { firebaseAuth, firebaseDB } from "../../db/firebase";

export default async function LoginRouteHandler(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email && !password) {
    res.status(500);
    throw Error("require email and password !!!");
  }

  // Example usage
  // firebaseDB
  //   .collection("users")
  //   .get()
  //   .then((snapshot) => {
  //     snapshot.forEach((doc) => {
  //       console.log(doc.id, "=>", doc.data());
  //     });
  //   })
  //   .catch((err) => {
  //     console.error("Error getting documents", err);
  //   });

  console.log({ email, password });

  res.json({ route: "login" });
}
