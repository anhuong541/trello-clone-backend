"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
// import { httpServer, wssport } from "./ws/index";
const index_1 = require("./web/index");
// Start the server
// module.exports = httpServer.listen(wssport, () => {
//   console.log(`Websocket is listening on ${wssport}`);
// });
module.exports = index_1.app;
//# sourceMappingURL=index.js.map