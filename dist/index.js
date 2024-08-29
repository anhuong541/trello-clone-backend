"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const index_1 = require("./ws/index");
const index_2 = require("./web/index");
// Start the server
index_1.httpServer.listen(index_1.wssport, () => {
    console.log(`Websocket is listening on ${index_1.wssport}`);
});
index_2.app.listen(index_2.port, () => {
    console.log(`express is listen to port: ${index_2.port}`);
});
module.exports = index_2.app;
//# sourceMappingURL=index.js.map