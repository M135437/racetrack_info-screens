import state from "./state.js"
import { RACE_MODES } from "../../client/src/shared/types.js"
import { saveState } from "../utils/persistState.js";
import { startTimer, resetTimer } from "./timer.js";

export function setDuration(RACE_DURATION) {
    state.timer.duration = RACE_DURATION;
}

// utility functions to support state update
export function getNextRaceId() {                   // goes through the array state.sessions[]
    const next = state.sessions.find((session) => {   // and returns the first with status 'notStarted'
        return session.status === 'notStarted';
    });
    return next ? next.id : null;
}

export function stateUptNextRaceId(id) {
    state.nextRace = id;
    saveState();
}

// main functions
export function stateUptStartSession(session, io) { // when start session command is received, this function is called with the session object 
    // that should be started, and the io object to emit timer updates to clients
    if (!session) {
        console.log("Updating state as per race start command failed, no session received for processing");
        return;
    }

    // If there is already a running race, we should mark it as ended before starting a new one. This ensures that the state remains consistent and accurately reflects the current status of
    state.sessions.forEach(s => {
        if (s.status === 'started') {
            s.status = 'ended'
        }
    })


    state.runningRace = session.id;
    console.log("state.raceMode enne: ", state.raceMode);
    state.raceMode = RACE_MODES.SAFE;
    session.startTime = Date.now();
    session.status = 'started';
    state.nextRace = getNextRaceId();
    state.leaderboard.push(...session.drivers);
    console.log("state.raceMode pärast: ", state.raceMode);

    resetTimer(); // reset the timer before starting a new one to ensure it starts with the correct duration and state

    startTimer(io); // start the timer when the session starts

    saveState();

}



export function stateUptChangeMode(mode) {
    state.raceMode = mode;
    saveState();
}

export function stateUptFinishMode(mode) {
    state.raceMode = RACE_MODES.FINISH;
    saveState();
}

export function stateUptEndSession() {
    state.raceMode = RACE_MODES.ENDED;
    state.runningRace = null;
    state.leaderboard = [];
    state.nextRace = getNextRaceId();

    state.session = 'ended';

    saveState();
}