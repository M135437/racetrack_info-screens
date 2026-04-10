import { ENV_VARIABLES } from "../config/env.js"
import state from "./state.js"
import { RACE_MODES } from "../../client/src/shared/types.js"

export function updatePort(RACE_DURATION) {
    state.timer.duration = RACE_DURATION;
}

    // two utilities to support state update
        // 1
function getNextPendingRaceId() {                   // goes through the array state.sessions[]
  const next = state.sessions.find((session) => {   // and returns the first with status 'notStarted'
    return  session.status === 'notStarted';
  });
  return next ? next.id : null;
}
        // 2
function getAllNextPendingRacesId() {           //REVIEW - not in use yet
  const allNextRaces = state.sessions.filter((session) => {
    return  session.status === 'notStarted';
  });
  return allNextRaces;
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
    state.nextRace = getNextPendingRaceId();
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