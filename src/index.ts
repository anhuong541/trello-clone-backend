import "module-alias/register";

import cookieParser from "cookie-parser";
import express, { Request } from "express";
import dotenv from "dotenv";
import cors, { CorsOptions, CorsOptionsDelegate } from "cors";
import {
  LoginRouteHandler,
  TokenVerifyHandler,
  LogoutRouteHandler,
  TakeUserInfoHandler,
  RegisterRouteHandler,
  ActiveUserAccountHandler,
} from "./routers/user";
import { AddProjectHandler, DeleteProjectHandler, EditProjectHandler, ProjectInfoHandler, ProjectListHandler } from "./routers/project";
import { CreateTaskHandler, DeleteTaskHandler, UpdateTaskHandler, ViewTasksHandler } from "./routers/task";
import { AddMemberHandler, EditMemberHandler, DeleteMemberHandler, ViewMemberHandler } from "./routers/members";
import { authorizationMidleware, authUserIsAMember, authUserIsProjectOwner } from "./lib/auth-action";
import TesttingRouteHandler from "./routers/test";

dotenv.config();
const app = express();
const port = process.env.PORT || 3456;

const allowedStaticDomains = [
  "http://localhost:3000",
  "https://trello-clone-client-three.vercel.app",
  "https://trello-clone-client-v2.vercel.app",
];
const vercelDomainPattern = /\.vercel\.app$/;

const corsOptionsOut = {
  optionsSuccessStatus: 200,
  credentials: true, // enable set cookie
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

// Dynamic CORS configuration in TypeScript
const corsOptionsDelegate: CorsOptionsDelegate | any = (req: Request, callback: (err: Error | null, options?: CorsOptions) => void) => {
  const origin = req.header("Origin");

  if (origin && (allowedStaticDomains.includes(origin) || vercelDomainPattern.test(origin))) {
    const corsOptions: CorsOptions = { origin: true, ...corsOptionsOut };
    callback(null, corsOptions); // Pass the CORS options
  } else {
    const corsOptions: CorsOptions = { origin: false };
    callback(null, corsOptions); // Pass the CORS options
  }
};

// Middleware
app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  console.log("it run!!!");
  res.json({ status: "success", text: "everything is clear!!!" });
});

app.post("/user/login", LoginRouteHandler);
app.post("/user/register", RegisterRouteHandler);
app.get("/user/logout", LogoutRouteHandler);
app.get("/user", TakeUserInfoHandler);
app.get("/user/token-verify", TokenVerifyHandler);
app.get("/user/:email/:hash", ActiveUserAccountHandler);

app.get("/project", authorizationMidleware, ProjectListHandler);
app.get("/project/:projectId", authorizationMidleware, ProjectInfoHandler);
app.post("/project", authorizationMidleware, AddProjectHandler);
app.put("/project", authorizationMidleware, EditProjectHandler);
app.delete("/project/:projectId", authorizationMidleware, DeleteProjectHandler);

app.get("/task/:projectId", authorizationMidleware, ViewTasksHandler);
app.put("/task", authorizationMidleware, authUserIsAMember, UpdateTaskHandler);
app.post("/task", authorizationMidleware, authUserIsAMember, CreateTaskHandler);
app.delete("/task/:projectId/:taskId", authorizationMidleware, DeleteTaskHandler);

app.get("/member/:projectId", authorizationMidleware, authUserIsAMember, ViewMemberHandler);
app.post("/member/:projectId", authorizationMidleware, authUserIsProjectOwner, AddMemberHandler);
app.put("/member/:projectId", authorizationMidleware, authUserIsProjectOwner, EditMemberHandler);
app.delete("/member/:projectId/:email", authorizationMidleware, authUserIsProjectOwner, DeleteMemberHandler);

app.get("/test", TesttingRouteHandler);

app.listen(port, () => {
  console.log(`express is listen to port: ${port}`);
});
