import { recordLap } from "../../services/lapService.js";
import EVENTS from "../../../client/src/shared/events.js";
import state from "../../state/state.js";


export default (io, socket) => {
    if (process.env.DEV_MODE) {console.log('\t --lapHandler() from lap.js');}

    socket.on(EVENTS.LAP_UPDATE, (driverId) => {
        const updatedDriver = recordLap(driverId);

        if (updatedDriver) {
            const activeSession = state.sessions.find(s => s.id === state.runningRace);
            
            io.emit(EVENTS.LAP_UPDATED, activeSession.drivers);
            // debug &| verbose output
            if (process.env.DEV_MODE) {console.log(`Server(lap.js): Car ${updatedDriver.car} crossed line: ${updatedDriver.latestLapTime}s`);};
        }
    })
}