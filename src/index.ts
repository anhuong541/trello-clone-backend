import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import "module-alias/register";
import jwt from "jsonwebtoken";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import config from "./config";
import { viewTasksProject } from "./lib/firebase-func";
import { generateUidByString } from "./lib/utils";
import {
  ActiveUserAccountHandler,
  LoginRouteHandler,
  LogoutRouteHandler,
  RegisterRouteHandler,
  TakeUserInfoHandler,
  TokenVerifyHandler,
} from "./routers/user";
import { AddProjectHandler, DeleteProjectHandler, EditProjectHandler, ProjectListHandler } from "./routers/project";
import { CreateTaskHandler, DeleteTaskHandler, UpdateTaskHandler, ViewTasksHandler } from "./routers/task";
import { AddMemberHandler, EditMemberHandler, DeleteMemberHandler } from "./routers/members";
import { authorizationMidleware, authUserIsAMember, authUserIsProjectOwner } from "./lib/auth-action";

dotenv.config();
const app = express();
const port = process.env.PORT || 3456;

const corsWebAllow = ["http://localhost:3000"];

const corsOptions = {
  origin: corsWebAllow,
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
app.post("/project", authorizationMidleware, AddProjectHandler);
app.put("/project", authorizationMidleware, EditProjectHandler); // ....
app.delete("/project/:projectId", authorizationMidleware, DeleteProjectHandler);
// update 2 api authority and members

app.get("/task/:projectId", authorizationMidleware, ViewTasksHandler);
app.post("/task", authorizationMidleware, authUserIsAMember, CreateTaskHandler);
app.put("/task", authorizationMidleware, authUserIsAMember, UpdateTaskHandler);
app.delete("/task/:projectId/:taskId", authorizationMidleware, DeleteTaskHandler);

app.post("/member/:projectId", authorizationMidleware, authUserIsProjectOwner, AddMemberHandler);
app.put("/member/:projectId", authorizationMidleware, authUserIsProjectOwner, EditMemberHandler);
app.delete("/member/:projectId/:email", authorizationMidleware, authUserIsProjectOwner, DeleteMemberHandler);

const server = http.createServer(app);
export const io = new Server(server, {
  cors: corsOptions,
});

// Setup Socket.IO connection
io.on("connection", (socket) => {
  // console.log("a user connected:", socket.id);

  const userCookie = socket?.handshake?.headers?.cookie?.split("=")[1] ?? null;
  // console.log("cookie: ", socket?.handshake?.headers?.cookie?.split("="));

  socket.on("join_project_room", async (projectId: string) => {
    socket.join(projectId);
    console.log("User: " + socket.id + " joined " + projectId);

    if (userCookie) {
      const verify: any = jwt.verify(userCookie, config.jwtSecret);
      const userId = generateUidByString(verify?.email ?? "");
      console.log("check authority: ", userId);

      const data = await viewTasksProject(projectId);
      io.to(projectId).emit("view_project", data);
    }
  });

  socket.on("realtime_update_project", (projectId, data) => {
    io.to(projectId).emit("realtime_update_project_client", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
