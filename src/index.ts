import "module-alias/register";
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import {
  ActiveUserAccountHandler,
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
  ProjectListHandler,
} from "./routers/project";
import {
  CreateTaskHandler,
  DeleteTaskHandler,
  UpdateTaskHandler,
  ViewTasksHandler,
} from "./routers/task";
import { authorizationMidleware } from "./lib/auth-action";

dotenv.config();
const app = express();
const port = process.env.PORT || 3456;

const corsWebAllow = [
  "http://localhost:3000",
  "https://trello-clone-mor-course-fe.vercel.app",
];

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
app.put("/project", authorizationMidleware, EditProjectHandler);
app.delete("/project/:projectId", authorizationMidleware, DeleteProjectHandler);

app.get("/task/:projectId", authorizationMidleware, ViewTasksHandler);
app.post("/task", authorizationMidleware, CreateTaskHandler);
app.put("/task", authorizationMidleware, UpdateTaskHandler);
app.delete(
  "/task/:projectId/:taskId",
  authorizationMidleware,
  DeleteTaskHandler
);

import http from "http";
import { Server } from "socket.io";
import { viewTasksProject } from "./lib/firebase-func";
import config from "./config";
import { generateUidByString } from "./lib/utils";

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

// Setup Socket.IO connection
io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  const userCookie = socket?.handshake?.headers?.cookie?.split("=")[1] ?? null;
  console.log("cookie: ", socket?.handshake?.headers?.cookie?.split("="));

  socket.on("message", (msg) => {
    console.log("message received:", msg);
    io.emit("message", msg);
  });

  socket.on("project_room", async (projectId: string) => {
    if (userCookie) {
      const verify: any = jwt.verify(userCookie, config.jwtSecret);

      const userId = generateUidByString(verify?.email ?? "");

      const data = await viewTasksProject(userId, projectId);
      io.emit(`project_room_${projectId}`, data);
    }
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
