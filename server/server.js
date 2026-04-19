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

// check that env variables are set to control if application can be started,
// set race duration accordingly
processEnvVar() // check env variables and set defaults if not set, also set duration from env variable if not already set in state (FIX) Olga
//setDuration(RACE_DURATION); //Olga


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

//Async bootstrap function to initialize the server and load state before starting the server (FIX) Olga
async function startServer() {
    await loadState(); // Load state before starting the server

    syncSessionCounter();


    // Set duration from env variable if not already set in state, otherwise keep the loaded duration
    if (!state.timer || !state.timer.duration) {
        setDuration(RACE_DURATION)
    }

    /* if (hasSavedDuration) {
        setDuration(RACE_DURATION); // Set duration from env variable if not already set in state
    }*/

    //SOCKETS

    socketHandlers(io);

    //START SERVER
    server.listen(ENV_VARIABLES.RACETRACK_SERVER_PORT, () => {
        console.log(`Server running on port ${ENV_VARIABLES.RACETRACK_SERVER_PORT}`)
        console.log(`Race duration: ${(state.timer.duration / 1000) / 60} min`)
    })
}

startServer();


/*
// pass Socket.IO on to handlers
socketHandlers(io);

// check if state has been stored
console.log(loadState());

server.listen(ENV_VARIABLES.RACETRACK_SERVER_PORT, () => {
    console.log(`  ➜  Server running on port ${ENV_VARIABLES.RACETRACK_SERVER_PORT}\n  ➜  http://localhost:${ENV_VARIABLES.RACETRACK_SERVER_PORT}/`);
    console.log(`  ➜  Race duration set to ${(RACE_DURATION / 1000) / 60} minutes`);

});*/

