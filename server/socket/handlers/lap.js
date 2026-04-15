import { recordLap } from "../../services/lapService.js";
import EVENTS from "../../../client/src/shared/events.js";
import state from "../../state/state.js";

export default (io, socket) => {

    console.log("LAP HANDLER TÖÖTAB SOCKETIGA:", socket.id);

    // nupuvajutusel clienti event:
    socket.on(EVENTS.LAP_UPDATE, (driverId) => {
        const updatedDriver = recordLap(driverId);

        if (updatedDriver) {
            const activeSession = state.sessions.find(s => s.id === state.runningRace);
            
            io.emit(EVENTS.LAP_UPDATED, activeSession.drivers);
            // ja testi jaoks jälle nupuvajutusel kontrolltekst:
            console.log(`Car ${updatedDriver.car} crossed line: ${updatedDriver.latestLapTime}s`);
        }
    })
}