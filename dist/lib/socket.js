"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ablyRealtime = void 0;
const tslib_1 = require("tslib");
const ably_1 = tslib_1.__importDefault(require("ably"));
const config_1 = tslib_1.__importDefault(require("../config"));
exports.ablyRealtime = new ably_1.default.Realtime(config_1.default.ablyKey);
//# sourceMappingURL=socket.js.map