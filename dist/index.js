"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
// import { httpServer, wssport } from "./ws/index";
const index_1 = require("./web/index");
// Start the server
// module.exports = httpServer.listen(wssport, () => {
//   console.log(`Websocket is listening on ${wssport}`);
// });
module.exports = index_1.app.listen(index_1.port, () => {
    console.log(`express is listen to port: ${index_1.port}`);
});
//# sourceMappingURL=index.js.map