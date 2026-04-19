import { io } from "socket.io-client";

const PORT = import.meta.env.VITE_SERVER_PORT || "3000";

const SOCKET_URL = `${window.location.protocol}//${window.location.hostname}:${PORT}`;

export const socket = io(SOCKET_URL, {
    autoConnect: true
});