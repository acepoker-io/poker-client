import { io } from "socket.io-client";
import CONSTANTS from "./contants";
// https://poker-server-t3e66zpola-uc.a.run.app

const socket = io(CONSTANTS.serverUrl, {
  transports: ["websocket"],
  rejectUnauthorized: false,
  reconnection: false,
});
socket.on("connect", () => {
  console.log("connected");
});
socket.on("disconnect", () => {
  window.location.href =
    window.location.origin + "/table" + window.location.search;
  console.log("Disconnected");
});

export { socket };
