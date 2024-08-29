import "module-alias/register";

import { httpServer, wssport } from "./ws/index";
import { app, port } from "./web/index";

// Start the server
httpServer.listen(wssport, () => {
  console.log(`Websocket is listening on ${wssport}`);
});

app.listen(port, () => {
  console.log(`express is listen to port: ${port}`);
});

module.exports = app;
