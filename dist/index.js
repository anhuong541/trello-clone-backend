"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("module-alias/register");
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const express_1 = tslib_1.__importDefault(require("express"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const user_1 = require("./routers/user");
const project_1 = require("./routers/project");
const task_1 = require("./routers/task");
const members_1 = require("./routers/members");
const auth_action_1 = require("./lib/auth-action");
const join_project_room_1 = tslib_1.__importDefault(require("./routers/join-project-room"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3456;
const corsWebAllow = ["http://localhost:3000", "https://trello-clone-client-three.vercel.app", "https://trello-clone-client-v2.vercel.app"];
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
app.get("/project/:projectId", auth_action_1.authorizationMidleware, project_1.ProjectInfoHandler);
app.post("/project", auth_action_1.authorizationMidleware, project_1.AddProjectHandler);
app.put("/project", auth_action_1.authorizationMidleware, project_1.EditProjectHandler);
app.delete("/project/:projectId", auth_action_1.authorizationMidleware, project_1.DeleteProjectHandler);
app.get("/task/:projectId", auth_action_1.authorizationMidleware, task_1.ViewTasksHandler);
app.put("/task", auth_action_1.authorizationMidleware, auth_action_1.authUserIsAMember, task_1.UpdateTaskHandler);
app.post("/task", auth_action_1.authorizationMidleware, auth_action_1.authUserIsAMember, task_1.CreateTaskHandler);
app.delete("/task/:projectId/:taskId", auth_action_1.authorizationMidleware, task_1.DeleteTaskHandler);
app.get("/member/:projectId", auth_action_1.authorizationMidleware, auth_action_1.authUserIsAMember, members_1.ViewMemberHandler);
app.post("/member/:projectId", auth_action_1.authorizationMidleware, auth_action_1.authUserIsProjectOwner, members_1.AddMemberHandler);
app.put("/member/:projectId", auth_action_1.authorizationMidleware, auth_action_1.authUserIsProjectOwner, members_1.EditMemberHandler);
app.delete("/member/:projectId/:email", auth_action_1.authorizationMidleware, auth_action_1.authUserIsProjectOwner, members_1.DeleteMemberHandler);
app.get("/joinProjectRoom/:projectId", auth_action_1.authorizationMidleware, join_project_room_1.default);
app.listen(port, () => {
    console.log(`express is listen to port: ${port}`);
});
//# sourceMappingURL=index.js.map