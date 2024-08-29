"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ActiveUserAccountHandler;
const tslib_1 = require("tslib");
const firebase_func_1 = require("@/lib/firebase-func");
const utils_1 = require("@/lib/utils");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const config_1 = tslib_1.__importDefault(require("@/config"));
function ActiveUserAccountHandler(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { email, hash } = req.params;
        const userId = (0, utils_1.generateUidByString)(email);
        const data = yield (0, firebase_func_1.getUserDataById)(userId);
        if (data === null || data === void 0 ? void 0 : data.isActive) {
            return res.redirect("http://localhost:3000/project");
        }
        try {
            yield jsonwebtoken_1.default.verify(data === null || data === void 0 ? void 0 : data.activationHash, config_1.default.jwtSecret);
        }
        catch (error) {
            yield (0, firebase_func_1.deleteAccountUnActive)(userId);
            return res.status(200).json({
                message: "email active is expired! Please register your email again!",
            });
        }
        if ((data === null || data === void 0 ? void 0 : data.activationHash) !== hash) {
            yield (0, firebase_func_1.deleteAccountUnActive)(userId);
            return res.status(200).json({
                message: "your something wrong when active your email please register with this email again!",
            });
        }
        const removeHashData = {
            uid: data.uid,
            username: data.username,
            email: data.email,
            password: data.password,
            createAt: data.createAt,
            activationHash: null,
            isActive: true,
        };
        yield (0, firebase_func_1.createNewUser)(userId, removeHashData); // update to remove hash active
        return res.redirect("http://localhost:3000/project");
    });
}
//# sourceMappingURL=index.js.map