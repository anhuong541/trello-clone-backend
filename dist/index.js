"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const tslib_1 = require("tslib");
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
require("module-alias/register");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const express_1 = tslib_1.__importDefault(require("express"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const http_1 = tslib_1.__importDefault(require("http"));
const config_1 = tslib_1.__importDefault(require("./config"));
const firebase_func_1 = require("./lib/firebase-func");
const utils_1 = require("./lib/utils");
const user_1 = require("./routers/user");
const project_1 = require("./routers/project");
const task_1 = require("./routers/task");
const auth_action_1 = require("./lib/auth-action");
dotenv_1.default.config();
const app = (0, express_1.default)();
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
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.get("/", (req, res) => {
    console.log("it run!!!");
    res.json({ status: "success", text: "everything is clear!!!" });
});
app.post("/user/login", user_1.LoginRouteHandler);
app.post("/user/register", user_1.RegisterRouteHandler);
app.get("/user/logout", user_1.LogoutRouteHandler);
app.get("/user", user_1.TakeUserInfoHandler);
app.get("/user/token-verify", user_1.TokenVerifyHandler);
app.get("/user/:email/:hash", user_1.ActiveUserAccountHandler);
app.get("/project", auth_action_1.authorizationMidleware, project_1.ProjectListHandler);
app.post("/project", auth_action_1.authorizationMidleware, project_1.AddProjectHandler);
app.put("/project", auth_action_1.authorizationMidleware, project_1.EditProjectHandler);
app.delete("/project/:projectId", auth_action_1.authorizationMidleware, project_1.DeleteProjectHandler);
app.get("/task/:projectId", auth_action_1.authorizationMidleware, task_1.ViewTasksHandler);
app.post("/task", auth_action_1.authorizationMidleware, task_1.CreateTaskHandler);
app.put("/task", auth_action_1.authorizationMidleware, task_1.UpdateTaskHandler);
app.delete("/task/:projectId/:taskId", auth_action_1.authorizationMidleware, task_1.DeleteTaskHandler);
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: corsOptions,
});
// Setup Socket.IO connection
exports.io.on("connection", (socket) => {
    // console.log("a user connected:", socket.id);
    var _a, _b, _c, _d;
    const userCookie = (_d = (_c = (_b = (_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.cookie) === null || _c === void 0 ? void 0 : _c.split("=")[1]) !== null && _d !== void 0 ? _d : null;
    // console.log("cookie: ", socket?.handshake?.headers?.cookie?.split("="));
    socket.on("join_project_room", (projectId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        socket.join(projectId);
        console.log("User: " + socket.id + " joined " + projectId);
        if (userCookie) {
            const verify = jsonwebtoken_1.default.verify(userCookie, config_1.default.jwtSecret);
            const userId = (0, utils_1.generateUidByString)((_a = verify === null || verify === void 0 ? void 0 : verify.email) !== null && _a !== void 0 ? _a : "");
            const data = yield (0, firebase_func_1.viewTasksProject)(userId, projectId);
            exports.io.to(projectId).emit("view_project", data);
        }
    }));
    socket.on("realtime_update_project", (projectId, data) => {
        exports.io.to(projectId).emit("realtime_update_project_client", data);
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
//# sourceMappingURL=index.js.map