import { io } from "socket.io-client";
import Ably from "ably";
import config from "./../config";

export const ablyRealtime = new Ably.Realtime(config.ablyKey);

export const socket = io("http://localhost:8080");
// move socket to context for global state manemanet
