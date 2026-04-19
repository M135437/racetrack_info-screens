import raceHandler from "./handlers/race.js";
import sessionHandler from "./handlers/session.js";
import lapHandler from "./handlers/lap.js";
import auth from "./auth.js";

import state from "../state/state.js";
import EVENTS from "../../client/src/shared/events.js";


function getSafeState() {
    return JSON.parse(JSON.stringify(state, (key, value) => {
        if (key === "timerStatus") return undefined;
        return value;
    }));
}

let initSocketOn = false;

export default function (io) {
    io.on("connection", (socket) => {
        if (process.env.DEV_MODE) {console.log(`Server: attaching socket handlers (Socket#ID: ${socket.id}): `);}

        socket.emit(EVENTS.STATE_DISTRIBUTED, getSafeState()); // send current state to client on connection
        socket.emit(EVENTS.SESSION_LISTED, state.sessions); // send session list to client on connection
        socket.emit(EVENTS.MODE_CHANGED, state.raceMode); // send current mode to client on connection
        socket.emit(EVENTS.TIMER_UPDATE, state.timer.timeRemaining); // send current timer value to client on connection

        auth(io, socket);
        raceHandler(io, socket);
        sessionHandler(io, socket);
        lapHandler(io, socket);
    });
};