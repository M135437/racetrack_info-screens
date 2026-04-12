import { io } from "socket.io-client";

// connection to backend (assuming port 3000)
export const socket = io("http://localhost:3000", {
    autoConnect: true
});