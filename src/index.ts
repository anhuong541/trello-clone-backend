import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const app = express();
const port = process.env.PORT || 3456;

// Middleware
app.use(cors());
app.use(express.json());

// Firebase setup
const serviceAccount = require(process.env
  .FIREBASE_SERVICE_ACCOUNT_KEY as string);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!!!!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
