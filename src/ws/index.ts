import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import http from "http";

import config from "./../config";
import { viewTasksProject } from "./../lib/firebase-func";
import { generateUidByString } from "./../lib/utils";
import { checkUserIsAllowJoiningProject } from "./../lib/auth-action";

dotenv.config();

const corsWebAllow = ["http://localhost:3000"];

const corsOptions = {
  origin: corsWebAllow,
  optionsSuccessStatus: 200,
  credentials: true, // enable set cookie
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

const httpServer = http.createServer();
export const io = new Server(httpServer, {
  cors: corsOptions,
});

const port = 8080;

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

      const check = await checkUserIsAllowJoiningProject(userId, projectId);

      if (check) {
        const data = await viewTasksProject(projectId);
        io.to(projectId).emit("view_project", data);
      } else {
        io.to(projectId).emit("view_project", {
          error: "User didn't allow to join this project",
          status: "fail",
        });
      }
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
httpServer.listen(port, () => {
  console.log(`Websocket is listening on ${port}`);
});
