import { io } from "socket.io-client";

export const socket = io("http://localhost:8080");
// move socket to context for global state manemanet
