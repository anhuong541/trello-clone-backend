"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = void 0;
const socket_io_client_1 = require("socket.io-client");
exports.socket = (0, socket_io_client_1.io)("http://localhost:8080");
// move socket to context for global state manemanet
//# sourceMappingURL=socket.js.map