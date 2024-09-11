"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFormatDataBoard = exports.readUserIdFromAuth = exports.readUserIdFromTheCookis = exports.checkUIDAndProjectExists = exports.generateUidByString = exports.generateNewUid = void 0;
const tslib_1 = require("tslib");
const uuid_1 = require("uuid");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const firebase_func_1 = require("./firebase-func");
const config_1 = tslib_1.__importDefault(require("../config"));
const generateNewUid = () => {
    return (0, uuid_1.v4)();
};
exports.generateNewUid = generateNewUid;
const generateUidByString = (inputString) => {
    const hash = crypto_1.default.createHash("sha256");
    hash.update(inputString);
    const uid = hash.digest("hex");
    return uid.slice(0, 35);
};
exports.generateUidByString = generateUidByString;
const checkUIDAndProjectExists = (userId, projectId, feat, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (!(yield (0, firebase_func_1.checkEmailUIDExists)(userId))) {
        return res.status(409).json({ status: "fail", error: "user doesn't exists!", feat });
    }
    if (!(yield (0, firebase_func_1.checkProjectExists)(projectId))) {
        return res.status(409).json({ status: "fail", error: "project doesn't exists!", feat });
    }
    return null;
});
exports.checkUIDAndProjectExists = checkUIDAndProjectExists;
const readUserIdFromTheCookis = (req) => {
    var _a;
    if (config_1.default.env) {
        return (0, exports.readUserIdFromAuth)(req); // only for deploy
    }
    const token = (_a = req === null || req === void 0 ? void 0 : req.cookies.user_session) !== null && _a !== void 0 ? _a : "";
    const { email } = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
    return (0, exports.generateUidByString)(email);
};
exports.readUserIdFromTheCookis = readUserIdFromTheCookis;
const readUserIdFromAuth = (req) => {
    var _a, _b;
    const token = (_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization.split(" ")[1]) !== null && _b !== void 0 ? _b : ""; // send at the client
    const { email } = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
    return (0, exports.generateUidByString)(email);
};
exports.readUserIdFromAuth = readUserIdFromAuth;
const handleFormatDataBoard = (data) => {
    var _a, _b, _c, _d;
    const dataLength = data.length;
    const createKanbanMap = new Map();
    data.forEach((item) => {
        var _a;
        const value = (_a = createKanbanMap.get(item.taskStatus)) !== null && _a !== void 0 ? _a : [];
        createKanbanMap.set(item.taskStatus, [...value, item]);
    });
    let dataBoard;
    if (dataLength > 0) {
        dataBoard = {
            Open: {
                label: "Open",
                table: (_a = createKanbanMap.get("Open")) !== null && _a !== void 0 ? _a : [],
            },
            "In-progress": {
                label: "In-progress",
                table: (_b = createKanbanMap.get("In-progress")) !== null && _b !== void 0 ? _b : [],
            },
            Resolved: {
                label: "Resolved",
                table: (_c = createKanbanMap.get("Resolved")) !== null && _c !== void 0 ? _c : [],
            },
            Closed: {
                label: "Closed",
                table: (_d = createKanbanMap.get("Closed")) !== null && _d !== void 0 ? _d : [],
            },
        };
    }
    else {
        dataBoard = {
            Open: {
                label: "Open",
                table: [],
            },
            "In-progress": {
                label: "In-progress",
                table: [],
            },
            Resolved: {
                label: "Resolved",
                table: [],
            },
            Closed: {
                label: "Closed",
                table: [],
            },
        };
    }
    createKanbanMap.clear();
    return {
        dataBoard,
        dataLength,
    };
};
exports.handleFormatDataBoard = handleFormatDataBoard;
//# sourceMappingURL=utils.js.map