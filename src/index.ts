import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  LoginRouteHandler,
  LogoutRouteHandler,
  RegisterRouteHandler,
} from "./routers";

dotenv.config();
const app = express();
const port = process.env.PORT || 3456;

const corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  console.log("it run!!!");
  res.json({ status: "success", text: "everything is clear!!!" });
});

app.post("/user/login", LoginRouteHandler);
app.post("/user/register", RegisterRouteHandler);
app.post("/user/logout", LogoutRouteHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
