"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("module-alias/register");
const express_1 = tslib_1.__importDefault(require("express"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const cors_1 = tslib_1.__importDefault(require("cors"));
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
const http_1 = tslib_1.__importDefault(require("http"));
const socket_io_1 = require("socket.io");
const firebase_func_1 = require("./lib/firebase-func");
const config_1 = tslib_1.__importDefault(require("./config"));
const utils_1 = require("./lib/utils");
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: corsOptions,
});
// Setup Socket.IO connection
io.on("connection", (socket) => {
    var _a, _b, _c, _d, _e, _f, _g;
    console.log("a user connected:", socket.id);
    const userCookie = (_d = (_c = (_b = (_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.cookie) === null || _c === void 0 ? void 0 : _c.split("=")[1]) !== null && _d !== void 0 ? _d : null;
    console.log("cookie: ", (_g = (_f = (_e = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _e === void 0 ? void 0 : _e.headers) === null || _f === void 0 ? void 0 : _f.cookie) === null || _g === void 0 ? void 0 : _g.split("="));
    socket.on("message", (msg) => {
        console.log("message received:", msg);
        io.emit("message", msg);
    });
    socket.on("project_room", (projectId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (userCookie) {
            const verify = jsonwebtoken_1.default.verify(userCookie, config_1.default.jwtSecret);
            const userId = (0, utils_1.generateUidByString)((_a = verify === null || verify === void 0 ? void 0 : verify.email) !== null && _a !== void 0 ? _a : "");
            const data = yield (0, firebase_func_1.viewTasksProject)(userId, projectId);
            io.emit(`project_room_${projectId}`, data);
        }
    }));
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