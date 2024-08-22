"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TakeUserInfoHandler;
const tslib_1 = require("tslib");
const firebase_func_1 = require("@/lib/firebase-func");
const utils_1 = require("@/lib/utils");
// import config from "@/config";
function TakeUserInfoHandler(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const feat = "user-info";
        const userId = (0, utils_1.readUserIdFromTheCookis)(req); // send at the server
        try {
            const data = yield (0, firebase_func_1.getUserDataById)(userId);
            return res.status(200).json({
                status: "success",
                message: "get user data success",
                feat,
                data,
            });
        }
        catch (error) {
            return res.status(404).json({
                status: "fail",
                message: "missing userId or something",
                feat,
                error,
            });
        }
    });
}
//# sourceMappingURL=index.js.map