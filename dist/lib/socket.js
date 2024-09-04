"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = exports.ablyRealtime = void 0;
const tslib_1 = require("tslib");
const socket_io_client_1 = require("socket.io-client");
const ably_1 = tslib_1.__importDefault(require("ably"));
exports.ablyRealtime = new ably_1.default.Realtime(process.env.ABLY_API_KEY);
exports.socket = (0, socket_io_client_1.io)("http://localhost:8080");
// move socket to context for global state manemanet
//# sourceMappingURL=socket.js.map