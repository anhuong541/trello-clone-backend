import "module-alias/register";

// import { httpServer, wssport } from "./ws/index";
import { app } from "./web/index";

// Start the server
// module.exports = httpServer.listen(wssport, () => {
//   console.log(`Websocket is listening on ${wssport}`);
// });

module.exports = app;
