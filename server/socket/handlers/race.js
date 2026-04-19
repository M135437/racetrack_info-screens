import EVENTS from "../../../client/src/shared/events.js"
import raceService from "../../services/raceService.js"
import state from "../../state/state.js"

function replacer(key, value) {
  if (key === "timerStatus") return undefined;
  if (key === "io") return undefined;
  if (key === "socket") return undefined;
  return value;
}

export default function raceHandler (io, socket) {
    if (process.env.DEV_MODE) {console.log("\t --raceHandler() from race.js");}
    
    if (process.env.DEV_MODE) {
        socket.onAny((event, ...args) => {
            console.log("VERBOSE MODE - EVENT RECEIVED:", event, args); // for debug purposes on dev
        });
    }
    socket.on(EVENTS.SESSION_START, () => {
        raceService.startSession(io);
    });
    socket.on(EVENTS.SESSION_MODE, (mode) => {
        raceService.changeMode(io,mode);
    });
    socket.on(EVENTS.SESSION_FINISH, () => {
        raceService.finishMode(io);
    });
    socket.on(EVENTS.SESSION_END, () => {
        raceService.endSession(io);
    });
    socket.on(EVENTS.STATE_GET, () => {
        raceService.distributeState(io);
    })
    socket.on("printstate", () => {
        const safeState = JSON.parse(JSON.stringify(state, replacer));
        socket.emit("printingstate", safeState);
    });
    socket.on("get:time", () => 
        raceService.getTime(io))

}