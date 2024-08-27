"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const tslib_1 = require("tslib");
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const http_1 = tslib_1.__importDefault(require("http"));
const config_1 = tslib_1.__importDefault(require("./../config"));
const firebase_func_1 = require("./../lib/firebase-func");
const utils_1 = require("./../lib/utils");
const auth_action_1 = require("./../lib/auth-action");
dotenv_1.default.config();
const corsWebAllow = ["http://localhost:3000"];
const corsOptions = {
    origin: corsWebAllow,
    optionsSuccessStatus: 200,
    credentials: true, // enable set cookie
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
};
const httpServer = http_1.default.createServer();
exports.io = new socket_io_1.Server(httpServer, {
    cors: corsOptions,
});
const port = 8080;
const getCookieValue = (name, cookies) => { var _a; return ((_a = cookies.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")) === null || _a === void 0 ? void 0 : _a.pop()) || ""; };
// Setup Socket.IO connection
exports.io.on("connection", (socket) => {
    // console.log("a user connected:", socket.id);
    var _a, _b;
    const cookies = (_b = (_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.cookie;
    socket.on("join_project_room", (projectId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        socket.join(projectId);
        console.log("User: " + socket.id + " joined " + projectId);
        const userSesstionCookie = getCookieValue("user_session", cookies);
        if (userSesstionCookie) {
            let verify = null;
            try {
                verify = jsonwebtoken_1.default.verify(userSesstionCookie, config_1.default.jwtSecret);
            }
            catch (error) {
                console.log("verify error at join_project_room", error);
                return;
            }
            const userId = (0, utils_1.generateUidByString)((_a = verify === null || verify === void 0 ? void 0 : verify.email) !== null && _a !== void 0 ? _a : "");
            const check = yield (0, auth_action_1.checkUserIsAllowJoiningProject)(userId, projectId);
            if (check) {
                const data = yield (0, firebase_func_1.viewTasksProject)(projectId);
                exports.io.to(projectId).emit("view_project", data);
            }
            else {
                exports.io.to(projectId).emit("view_project", {
                    error: "User didn't allow to join this project",
                    status: "fail",
                });
            }
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
httpServer.listen(port, () => {
    console.log(`Websocket is listening on ${port}`);
});
//# sourceMappingURL=index.js.map