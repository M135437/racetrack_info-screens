import { io } from "socket.io-client";

// Connect to the Socket.IO server at the specified URL. 
// Make sure to replace "http://localhost:3000" with the actual URL of your Socket.IO server if it's different.
// Socket for the whole app, so we can use it in any component that needs to listen for or emit events.
export const socket = io("http://localhost:3000", {
    auth: {
        from: "client",
        time: Date.now()
    }
});