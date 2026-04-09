import EVENTS from "../../../client/src/shared/events.js"
import raceService from "../../services/raceService.js"

export default function raceHandler (socket, io) {
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

}