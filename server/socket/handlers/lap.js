import { recordLap } from "../../services/lapService.js";
import EVENTS from "../../../client/src/shared/events.js";
import state from "../../state/state.js";

export default (io, socket) => {

    console.log("LAP HANDLER TÖÖTAB SOCKETIGA:", socket.id);

    socket.on(EVENTS.LAP_UPDATE, (driverId) => {
        const updatedDriver = recordLap(driverId);

        if (updatedDriver) {
            const activeSession = state.sessions.find(s => s.id === state.runningRace);
            
            io.emit(EVENTS.LAP_UPDATED, activeSession.drivers);
            // testimiseks:
            console.log(`Car ${updatedDriver.car} crossed line: ${updatedDriver.latestLapTime}s`);
        }
    })
}