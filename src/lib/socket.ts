import { io } from "socket.io-client";
import Ably from "ably";

export const ablyRealtime = new Ably.Realtime(process.env.ABLY_API_KEY);

export const socket = io("http://localhost:8080");
// move socket to context for global state manemanet
