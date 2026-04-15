import state from "../state/state.js";
import * as stateMachine from "../state/stateMachine.js";

export const recordLap = (driverId) => {
    // testimiseks:
    console.log(`Server received lap for Driver ID: ${driverId}`);

    const activeSession = stateMachine.stateUptStartSession;

    const driversList = activeSession.drivers;
    if (!driversList) {
        console.error("could not find a drivers list inside state object");
        return null;
    }

    // konkreetse sõitja info saamine find()-ga:
    const driver = driversList.find(d => d.id === driverId);

    const hasStarted = state.runningRace;

    // errori/puuduliku info käsitlus ja ringiaja salvestamise
    // õiguse valideerimine:
    if (!driver || driver.isFinished || !hasStarted) {
        // kas state asemel "!EVENTS.SESSION_STARTED" ?
        return null;
    } // (varasemalt ühenupuvers - hasstarted ja finallap (canlap)
    // piisav nupulukuks post-timer. seega nüüd vaja siduda iga
    // sõitjaga, et ühe sõitja finallap ei lukustaks KÕIKIDE lap-nuppe)

    // mitmikkontrolliga taimeriinfo:
    const secondsLeft = state.secondsLeft ?? state.timer?.secondsLeft ?? 0;
    // (?? puhul vastavalt tingimusele märkidest vasak- v parempoolne väärtus)
    
    // vana: const secondsLeft = state.secondsLeft; // <- TAIMERI INFO 
    const now = Date.now(); // <- STOPPERI ALGPUNKT, aja arvutamiseks

    // -> SÕIDETAVA RINGI NR ARVUTAMINE
    // kui ringide hulk on 0 või null,
    if (driver.lapCount === 0 || driver.lapCount === null) {
        driver.lapCount = 1; // siis muutub see 1ks
        driver.lastLapTimestamp = now; // ja essal (1) jooneületusel
        // fikseerime sõitja
        // emitState(); // originaalis edastasime ka muutused;
        // nüüd teeb seda socket-handler

        return driver; // tagastame sõitja-OBJEKTI
    }

    // -> SÕITJA RINGIAEGADE ARVUTAMINE
    // konkreetse sõitja algusaja/ületusaja defineerimine,
    // kui lapCount > 0 (algus kui 1, ringiaeg kui üle 2)
    const startTime = driver.lastLapTimestamp;
    const elapsed = (now - startTime) / 1000; // aja arvutuskäik

    driver.latestLapTime = elapsed.toFixed(3); // 3 komakohta millisekundeid DISPLEI-VERSIOON!!
    driver.lapCount++; // ÄRA UNUSTA KA RINGI JUURDE LUGEDA!!

    // -> ÜHE SÕITJA PARIM AEG:
    // konkreetse sõitja parima aja arvestus:
    const currentLap = parseFloat(driver.latestLapTime); // stringist saadud ARV
    /* ja loome loogika parimaks ajaks LIHTSAIMAL MOEL ehk
    kõrvutades kaks aega ja jättes alles AINULT parima: */
    if (driver.fastestLap === null || currentLap < driver.fastestLap) {
        driver.fastestLap = currentLap;
    }

    // -> FINISH-MODE MÕJU NUPULE (hetkel taimeripõhine):
    // joonenupul pole mõju, kui pole sõit alanud v juba viimane ring sooritatud
    if (secondsLeft <= 0) { // pean mihkli kontrollpaneeli ootama - kas "finish"
    // nullib taimeri ja/või muudab raceMode-i?
        driver.isFinished = true;
        // kui on sekundid nullis ja vajutatakse nuppu,
        // siis seejärel saab isFinished tõese väärtuse
    }

    driver.lastLapTimestamp = now; // nupuvajutusel uue ajaarvamise alguse määramine
    return driver; // objekti tagastamine
};