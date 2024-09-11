"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TesttingRouteHandler;
const tslib_1 = require("tslib");
function TesttingRouteHandler(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return res.status(200).send({ text: "testing api" });
    });
}
//# sourceMappingURL=test.js.map