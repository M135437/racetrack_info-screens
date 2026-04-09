// NB! esialgu jätan õpikommentaarid sisse, aga enne main-i
// merge-i võtan maha (mul on nii lihtsam õppida)

/* AINUS ÜLESANNE, ON "KUULATA" LAPTRACKERIST TULEVAT INFOT (ping)
TEAVITADA SELLEST SERVICE-ILE NING KUULUTADA ÜLE SÜSTEEMI, ET
TOIMUS MINGISUGUNE MUUDATUS
nn switchboard-logic -> saab signaali ja suunab töötlusse */

// IMPORDID (testandmetega):
import { recordLap/*, getMockState, startMockRace */ } from "../../services/lapService.js";
// seisund - aeg (taimer) ja objekt (racer)
// import { state } from "../../state/state.js";
// ebavajalik, sest recordLap ise oma failis impordib ja kasutab
// infovahetus
// import { emitState } from "../index.js";
// vb nimi emitState vajab muutmist

// event-ide import ühtlustamaks io-socket infovahetust:
import EVENTS from "../../../client/src/shared/events.js";
/* pärast dev2 muutusi, edaspidi tuleb events.js kaudu emit-on suhtlus, st:
race:started -> EVENTS.SESSION_STARTED
record-lap -> EVENTS.LAP_RECORD
lap:updated -> EVENTS.LAP_RECORDED
jne
*/

/* esialgne pre-test versioon
export const lapHandler = (io, socket) => {
    socket.on("record-lap", (racerId) => {
        const updatedRacer = recordLap(racerId);

        // kui on toimunud muudatus, siis:
        if (updatedRacer) {
            // teavitatakse sellest kogu süsteemi
            emitState(io);
        };
    });
}; */

// NB! TEHTUD MUUDATUS, kus:
// võistlus ise -> session
// racer -> driver

// (testfaasis oli MOCK-andmetega testversioon handler-ist)
export default (io, socket) => {

    // ühendusprobleemi kontroll:
    console.log("LAP HANDLER TÖÖTAB SOCKETIGA:", socket.id);

    /* TESTFAASIS käiviti (sandbox-server vers):
    // kui LapTracker komponent laeb, saadetakse sellele mock-andmete info
    socket.emit("lap:init", getMockState().drivers); */

    /* TESTFAASIS viitega sõidualustamine:
    // automaatne võidusõidu alustamine, et testida, kas nupud
    // tekivad alles siis kui on vajutatud "start"
    setTimeout(() => {
        startMockRace(); //seame vajalikud muundujad paika
        io.emit(EVENTS.SESSION_STARTED, getMockState());
    }, 3000); // viide 3 sek; siis tekivad nupud. enne seda "waiting.."
    */

    // nupuvajutusel:
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