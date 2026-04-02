// NB! esialgu jätan õpikommentaarid sisse, aga enne main-i
// merge-i võtan maha (mul on nii lihtsam õppida)

/* AINUS ÜLESANNE, ON "KUULATA" LAPTRACKERIST TULEVAT INFOT (ping)
TEAVITADA SELLEST SERVICE-ILE NING KUULUTADA ÜLE SÜSTEEMI, ET
TOIMUS MINGISUGUNE MUUDATUS
nn switchboard-logic -> saab signaali ja suunab töötlusse */

// IMPORDID:
import { recordLap } from "../../services/lapService.js";
// seisund - aeg (taimer) ja objekt (racer)
// import { state } from "../../state/state.js"; <- selgus, et handleris
// ebavajalik, sest recordLap ise oma failis impordib ja kasutab
// infovahetus
import { emitState } from "../index.js";
// vb nimi emitState vajab muutmist

export const lapHandler = (io, socket) => {
    socket.on("record-lap", (racerId) => {
        const updatedRacer = recordLap(racerId);

        // kui on toimunud muudatus, siis:
        if (updatedRacer) {
            // teavitatakse sellest kogu süsteemi
            emitState(io);
        };
    });
};
