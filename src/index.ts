import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  CheckEmailIsValidRouteHandler,
  LoginRouteHandler,
  LogoutRouteHandler,
  RegisterRouteHandler,
  TakeUserInfoHandler,
  TokenVerifyHandler,
} from "./routers/user";
import {
  AddProjectHandler,
  DeleteProjectHandler,
  EditProjectHandler,
  ProjectInfoHandler,
  ProjectListHandler,
} from "./routers/project";
import {
  CreateTaskHandler,
  UpdateTaskHandler,
  ViewTasksHandler,
} from "./routers/task";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = process.env.PORT || 3456;

const corsOptions = {
  origin: ["http://localhost:3000"],
  optionsSuccessStatus: 200,
  credentials: true, // enable set cookie
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req: Request, res: Response) => {
  console.log("it run!!!");
  res.json({ status: "success", text: "everything is clear!!!" });
});

app.post("/user/login", LoginRouteHandler);
app.post("/user/email-verify", CheckEmailIsValidRouteHandler);
app.get("/user/token-verify", TokenVerifyHandler);
app.post("/user/register", RegisterRouteHandler);
app.get("/user/logout", LogoutRouteHandler);
app.get("/user", TakeUserInfoHandler);

app.get("/project", ProjectListHandler);
app.delete("/project/:projectId", DeleteProjectHandler);
app.put("/project", EditProjectHandler);
app.post("/project", AddProjectHandler);

app.get("/task/:projectId", ViewTasksHandler);
app.post("/task", CreateTaskHandler);
app.put("/task", UpdateTaskHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
