import processEnvVar from "./utils/processEnvirVariables.js"
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import socketHandlers from "./socket/index.js"
import { ENV_VARIABLES, RACE_DURATION } from "./config/env.js"
import { setDuration } from "./state/stateMachine.js"
import { loadState } from "./utils/persistState.js"

import state from "./state/state.js" //Olga - for testing purposes, to check if state is loaded correctly
import { syncSessionCounter } from "./services/sessionService.js"

// check env variables and set defaults if not set
processEnvVar()

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

//Async bootstrap function to initialize the server and load state before starting the server
async function startServer() {
    await loadState(io); // Load state before starting the server

    syncSessionCounter();

    // Set duration from env variable if not already set in state, otherwise keep the loaded duration
    if (!state.timer || !state.timer.duration) {
        setDuration(RACE_DURATION)
    }

    socketHandlers(io);

    // START LISTEN ON SERVER
    server.listen(ENV_VARIABLES.VITE_SERVER_PORT, () => {
        console.log(`  ➜  Server running on port: ${ENV_VARIABLES.VITE_SERVER_PORT}`)
        console.log(`  ➜  Race duration: ${(state.timer.duration / 1000) / 60} min`)
    })
}

startServer();
