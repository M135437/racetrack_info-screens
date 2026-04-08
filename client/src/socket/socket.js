import { io } from "socket.io-client";

/*export const socket = io("http://localhost:3000", {
    autoConnect: false, // control connection manually for better lifecycle management
    auth: { // optional auth data if needed
        from: "client", // just an example, can be anything relevant
        time: Date.now() // 1000 // timestamp in seconds
    }
});

// Debug / lifecycle logs
socket.on("connect", () => { // REVIEW - for testing connection lifecycle; can be removed in production
    console.log("✅ Connected:", socket.id); // REVIEW - log socket ID on connect
});

socket.on("disconnect", (reason) => { // REVIEW - log reason for disconnection; can be useful for debugging
    console.log("❌ Disconnected:", reason); // REVIEW - log reason for disconnection; can be useful for debugging
});

socket.on("connect_error", (err) => { // REVIEW - log connection errors; can be useful for debugging connection issues
    console.error("⚠️ Connection error:", err.message); // REVIEW - log connection errors; can be useful for debugging connection issues
});*/

// Simplified version for testing without lifecycle logs, with adapted parameter order to match server handler:

export const socket = io("http://localhost:3000", {
    autoConnect: false
});

socket.on("connect", () => {
    console.log("✅ Connected:", socket.id);
});

socket.onAny((event, ...args) => {
    console.log("📡 RAW EVENT:", event, args);
});

console.log("Socket file loaded");

