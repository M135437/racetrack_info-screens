// NB! esialgu jätan õpikommentaarid sisse, aga enne main-i
// merge-i võtan maha (mul on nii lihtsam õppida)

/* tõstan siia vanast versioonist üle nupuloogika, mille alusel
toimis jooneületuse loogika:
- ajaarvestus algab esmaületuse ehk esmase nupuvajutusega
- praegu puudub nupul mõju, kui sõitjal on isFinished tõene
või taimeril hasStarted väär (pean küsima state-info
nime/vormingut)
NB! ei kopeeri emit-e, sest see töö kuulub socket handleri alla!
service-failid jätkuvalt PUHAS LOOGIKA!
*/

// -> IMPORT
import { state } from "../state/state.js";

// kogu süsteemile ekspordi abil kättesaadavaks
// -> NUPUVAJUTUSE LOOGIKA
export const recordLap = (racerId) => {
    // testimiseks:
    console.log(`Server received lap for Racer ID: ${racerId}`);
    
    // konkreetse sõitja info saamine find()-ga:
    const racer = state.racers.find(r => r.id === racerId);
    // kui tahta leida otse id-alusel (nb!indeksid!!), siis:
    // const racer = racers[racerId];

    // errori/puuduliku info käsitlus ja ringiaja salvestamise
    // õiguse valideerimine:
    if (!racer || racer.isFinished || !state.hasStarted) {
        return null;
    } // (varasemalt ühenupuvers - hasstarted ja finallap (canlap)
    // piisav nupulukuks post-timer. seega nüüd vaja siduda iga
    // sõitjaga, et ühe sõitja finallap ei lukustaks KÕIKIDE lap-nuppe)

const secondsLeft = state.secondsLeft; // <- TAIMERI INFO
const now = Date.now(); // <- STOPPERI ALGPUNKT, aja arvutamiseks

// -> SÕIDETAVA RINGI NR ARVUTAMINE
// kui ringide hulk on 0 või null,
if (racer.lapCount === 0 || racer.lapCount === null) {
    racer.lapCount = 1; // siis muutub see 1ks
    racer.lastLapTimestamp = now; // ja essal (1) jooneületusel
    // fikseerime sõitja
    // emitState(); // originaalis edastasime ka muutused;
    // nüüd teeb seda socket-handler

    return racer; // tagastame sõitja-OBJEKTI
}

// -> SÕITJA RINGIAEGADE ARVUTAMINE
// konkreetse sõitja algusaja/ületusaja defineerimine,
// kui lapCount > 0 (algus kui 1, ringiaeg kui üle 2)
const startTime = racer.lastLapTimestamp;
const elapsed = (now - startTime) / 1000; // aja arvutuskäik
        
racer.latestLapTime = elapsed.toFixed(3); // 3 komakohta millisekundeid DISPLEI-VERSIOON!!
racer.lapCount++; // ÄRA UNUSTA KA RINGI JUURDE LUGEDA!!

// -> ÜHE SÕITJA PARIM AEG:
// konkreetse sõitja parima aja arvestus:
const currentLap = parseFloat(racer.latestLapTime); // stringist saadud ARV
/* ja loome loogika parimaks ajaks LIHTSAIMAL MOEL ehk
kõrvutades kaks aega ja jättes alles AINULT parima: */
if (racer.bestLapTime === null || currentLap < racer.bestLapTime) {
    racer.bestLapTime = currentLap;
}

// -> FINISH-MODE MÕJU NUPULE (hetkel taimeripõhine):
// joonenupul pole mõju, kui pole sõit alanud v juba viimane ring sooritatud
if (state.secondsLeft <= 0) {
    racer.isFinished = true;
    // kui on sekundid nullis ja vajutatakse nuppu,
    // siis seejärel saab isFinished tõese väärtuse
}

racer.lastLapTimestamp = now; // nupuvajutusel uue ajaarvamise alguse määramine
return racer; // objekti tagastamine
};