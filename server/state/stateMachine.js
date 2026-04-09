import { ENV_VARIABLES } from "../config/env.js"
import state from "./state.js"
import { RACE_MODES } from "../../client/src/shared/types.js"

export function updatePort(RACE_DURATION) {
    state.timer.duration = RACE_DURATION;
}

export function stateUptStartSession(session) {
    if (!session) {
        return;
    }
    state.runningRace = session.id;
    state.raceMode = RACE_MODES.SAFE;
    session.startTime = Date.now();
    session.startTimeStamp = Date.now();
    session.hasStarted = true;
    session.status = 'started';
    // state.nextRace = getNextPendingRaceId(); // eraldi funktsiooni jagu ülesanne
}

export function stateUptChangeMode(mode) {
    state.raceMode = mode;
}

export function stateUptFinishMode(mode) {
    state.raceMode = RACE_MODES.FINISH;
}

export function stateUptEndSession() {
    state.raceMode = RACE_MODES.ENDED;
    state.runningRace = null;
    state.currentRace = null;
    state.nextRace = getNextPendingRaceId();
}