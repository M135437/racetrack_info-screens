import { recordLap } from "../../services/lapService.js";
import EVENTS from "../../../client/src/shared/events.js";

export default (io, socket) => {

    console.log("LAP HANDLER TÖÖTAB SOCKETIGA:", socket.id);

    // nupuvajutusel clienti event:
    socket.on(EVENTS.LAP_UPDATE, (driverId) => {
        const updatedDriver = recordLap(driverId);

        if (updatedDriver) {
            // pole (veel?) ühtset state-emit-i, seega tavaline io:
            io.emit(EVENTS.LAP_UPDATED, updatedDriver);
            // ja testi jaoks jälle nupuvajutusel kontrolltekst:
            console.log(`Car ${updatedDriver.car} crossed line: ${updatedDriver.latestLapTime}s`);
        }
    })
}