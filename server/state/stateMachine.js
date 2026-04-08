import { ENV_VARIABLES } from "../config/env.js"
import state from "./state.js"

export function updatePort(RACE_DURATION) {
    state.timer.duration = RACE_DURATION;
}

export function stateUptStartSession(session) {
    state.nextRace = +state.currentRace +1;
    state.raceMode = RACE_MODES.SAFE;   
    session.startTime = startTime;  // REVIEW -- vt koos Olgaga, kuidas session mgmt kokku käima saada
                                    //  - kas läbi state.currentRace.startTime vmuud moodi
    // endtime - currently out of use // REVIEW
    session.status = 'started';
}

export function stateUptChangeMode(mode) {
    state.raceMode = mode;
}

export function stateUptFinishMode() {
    state.raceMode = RACE_MODES.FINISH;
}

export function stateUptEndSession() {
    state.raceMode = RACE_MODES.ENDED;
}