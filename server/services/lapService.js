import state from "../state/state.js";

export const recordLap = (carId) => {
    // testimiseks:
    console.log(`Server received lap for Car ID: ${carId}`);

    const activeSession = state.sessions.find(s => s.id === state.runningRace);


    if (!activeSession) {
        console.error("no active session found for ID: ", state.runningRace);
    }

    const carsList = activeSession.cars;

    if (!carsList) {
        console.error("could not find a cars list inside state object");
        return null;
    }

    // konkreetse sõitja info saamine find()-ga:
    const car = carsList.find(d => d.id === carId);

    const hasStarted = state.runningRace;

    // errori/puuduliku info käsitlus ja ringiaja salvestamise
    // õiguse valideerimine:
    if (!car || car.isFinished || !hasStarted) {
        // kas state asemel "!EVENTS.SESSION_STARTED" ?
        return null;
    } // (varasemalt ühenupuvers - hasstarted ja finallap (canlap)
    // piisav nupulukuks post-timer. seega nüüd vaja siduda iga
    // sõitjaga, et ühe sõitja finallap ei lukustaks KÕIKIDE lap-nuppe)

    // mitmikkontrolliga taimeriinfo:
    const secondsLeft = state.timer.timeRemaining || 0;
    // (?? puhul vastavalt tingimusele märkidest vasak- v parempoolne väärtus)

    // vana: const secondsLeft = state.secondsLeft; // <- TAIMERI INFO 
    const now = Date.now(); // <- STOPPERI ALGPUNKT, aja arvutamiseks

    // -> SÕIDETAVA RINGI NR ARVUTAMINE
    // kui ringide hulk on 0 või null,
    if (car.lapCount === 0 || car.lapCount === null) {
        car.lapCount = 1; // siis muutub see 1ks
        car.lastLapTimestamp = now; // ja essal (1) jooneületusel
        // fikseerime sõitja
        // emitState(); // originaalis edastasime ka muutused;
        // nüüd teeb seda socket-handler

        return car; // tagastame sõitja-OBJEKTI
    }

    // -> SÕITJA RINGIAEGADE ARVUTAMINE
    // konkreetse sõitja algusaja/ületusaja defineerimine,
    // kui lapCount > 0 (algus kui 1, ringiaeg kui üle 2)
    const startTime = car.lastLapTimestamp;
    const elapsed = (now - startTime) / 1000; // aja arvutuskäik

    car.latestLapTime = elapsed.toFixed(3); // 3 komakohta millisekundeid DISPLEI-VERSIOON!!
    car.lapCount++; // ÄRA UNUSTA KA RINGI JUURDE LUGEDA!!

    // -> ÜHE SÕITJA PARIM AEG:
    // konkreetse sõitja parima aja arvestus:
    const currentLap = parseFloat(car.latestLapTime); // stringist saadud ARV
    /* ja loome loogika parimaks ajaks LIHTSAIMAL MOEL ehk
    kõrvutades kaks aega ja jättes alles AINULT parima: */
    if (car.fastestLap === null || currentLap < car.fastestLap) {
        car.fastestLap = currentLap;
    }

    // -> FINISH-MODE MÕJU NUPULE (hetkel taimeripõhine):
    // joonenupul pole mõju, kui pole sõit alanud v juba viimane ring sooritatud
    if (secondsLeft <= 0 || state.raceMode === "finish") { // pean mihkli kontrollpaneeli ootama - kas "finish"
        // nullib taimeri ja/või muudab raceMode-i?
        car.isFinished = true;
        // kui on sekundid nullis ja vajutatakse nuppu,
        // siis seejärel saab isFinished tõese väärtuse
    }

    car.lastLapTimestamp = now; // nupuvajutusel uue ajaarvamise alguse määramine
    return car; // objekti tagastamine
};