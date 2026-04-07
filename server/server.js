
// Simple Express server with Socket.IO for real-time communication (minimal setup - module syntax)
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import socketHandlers from "./socket/index.js"
import { ENV_VARIABLES, RACE_DURATION } from "./config/env.js"

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.get("/test", (req, res) => {
    res.json({ ok: true });
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});

socketHandlers(io);

server.listen(ENV_VARIABLES.RACETRACK_SERVER_PORT, () => {
    console.log(`Server running on port ${ENV_VARIABLES.RACETRACK_SERVER_PORT}`);
});