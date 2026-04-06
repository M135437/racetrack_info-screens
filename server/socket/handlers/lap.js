// NB! esialgu jätan õpikommentaarid sisse, aga enne main-i
// merge-i võtan maha (mul on nii lihtsam õppida)

/* AINUS ÜLESANNE, ON "KUULATA" LAPTRACKERIST TULEVAT INFOT (ping)
TEAVITADA SELLEST SERVICE-ILE NING KUULUTADA ÜLE SÜSTEEMI, ET
TOIMUS MINGISUGUNE MUUDATUS
nn switchboard-logic -> saab signaali ja suunab töötlusse */

// IMPORDID (testandmetega):
import { recordLap, getMockState, startMockRace } from "../../services/lapService.js";
// seisund - aeg (taimer) ja objekt (racer)
// import { state } from "../../state/state.js"; <- selgus, et handleris
// ebavajalik, sest recordLap ise oma failis impordib ja kasutab
// infovahetus
// import { emitState } from "../index.js";
// vb nimi emitState vajab muutmist

/* pärast dev2 muutusi, edaspidi tuleb events.js kaudu emit-on suhtlus:
import EVENTS from "../../../client/src/shared/events.js"
st:
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

// MOCK-andmetega testversioon handler-ist:
export default (io, socket) => {

    // ühendusprobleemi kontroll:
    console.log("LAP HANDLER TÖÖTAB SOCKETIGA:", socket.id);

    // kui LapTracker komponent laeb, saadetakse sellele mock-andmete info
    socket.emit("lap:init", getMockState().racers);

    // automaatne võidusõidu alustamine, et testida, kas nupud
    // tekivad alles siis kui on vajutatud "start"
    setTimeout(() => {
        startMockRace(); //seame vajalikud muundujad paika
        io.emit("race:started", getMockState());
    }, 3000); // viide 3 sek; siis tekivad nupud. enne seda "waiting.."

    // nupuvajutusel:
    socket.on("record-lap", (racerId) => {
        const updatedRacer = recordLap(racerId);

        if (updatedRacer) {
            // pole veel ühtset state-emit-i, seega tavaline io:
            io.emit("lap:update", updatedRacer);
            // ja testi jaoks jälle nupuvajutusel kontrolltekst:
            console.log(`Car ${updatedRacer.car} crossed line: ${updatedRacer.latestLapTime}s`);
        }
    })
}