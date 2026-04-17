import processEnvVar from "./utils/processEnvirVariables.js"
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import socketHandlers from "./socket/index.js"
import { ENV_VARIABLES, RACE_DURATION } from "./config/env.js"
import {setDuration} from "./state/stateMachine.js"

// check that env variables are set to control if application can be started,
// set race duration accordingly
processEnvVar()
setDuration(RACE_DURATION);

// Simple Express server with Socket.IO for real-time communication (minimal setup - module syntax)
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

// pass Socket.IO on to handlers
socketHandlers(io);

server.listen(ENV_VARIABLES.RACETRACK_SERVER_PORT, () => {
    console.log(`  ➜  Server running on port ${ENV_VARIABLES.RACETRACK_SERVER_PORT}\n  ➜  http://localhost:${ENV_VARIABLES.RACETRACK_SERVER_PORT}/`);
    console.log(`  ➜  Race duration set to ${(RACE_DURATION / 1000) / 60} minutes`);
});