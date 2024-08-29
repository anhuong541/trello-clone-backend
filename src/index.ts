import "module-alias/register";

// import { httpServer, wssport } from "./ws/index";
import { app, port } from "./web/index";

// Start the server
// module.exports = httpServer.listen(wssport, () => {
//   console.log(`Websocket is listening on ${wssport}`);
// });

module.exports = app.listen(port, () => {
  console.log(`express is listen to port: ${port}`);
});
