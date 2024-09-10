import Ably from "ably";
import config from "../config";

export const ablyRealtime = new Ably.Realtime(config.ablyKey);
