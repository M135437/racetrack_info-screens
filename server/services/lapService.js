import state from "../state/state.js";

export const recordLap = (driverId) => {
    // testimiseks:
    console.log(`Server received lap for Driver ID: ${driverId}`);

    const activeSession = state.sessions.find(s => s.id === state.runningRace);
    
    if (!activeSession) {
        console.error("no active session found for ID: ", state.runningRace);
    }

    const driversList = activeSession.drivers;

    if (!driversList) {
        console.error("could not find a drivers list inside state object");
        return null;
    }

    const driver = driversList.find(d => d.id === driverId);
    const hasStarted = state.runningRace;


    if (!driver || driver.isFinished || !hasStarted) {
        return null;
    }

    const secondsLeft = state.timer.timeRemaining || 0;

    const now = Date.now(); // <- STOPPERI ALGPUNKT, aja arvutamiseks

    if (driver.lapCount === 0 || driver.lapCount === null) {
        driver.lapCount = 1;
        driver.lastLapTimestamp = now;

        return driver;
    }

    const startTime = driver.lastLapTimestamp;
    const elapsed = (now - startTime) / 1000; 

    driver.latestLapTime = elapsed.toFixed(3); // 3 komakohta millisekundeid DISPLEI-VERSIOON!!
    driver.lapCount++;

    const currentLap = parseFloat(driver.latestLapTime);
    if (driver.fastestLap === null || currentLap < driver.fastestLap) {
        driver.fastestLap = currentLap;
    }

    if (secondsLeft <= 0 || state.raceMode === "finish") { 

        driver.isFinished = true;
    }

    driver.lastLapTimestamp = now;
    return driver; 
};