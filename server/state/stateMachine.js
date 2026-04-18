import { ENV_VARIABLES } from "../config/env.js"
import state from "./state.js"
import { RACE_MODES } from "../../client/src/shared/types.js"

export function setDuration(RACE_DURATION) {
    state.timer.duration = RACE_DURATION;
}

    // utility functions to support state update
export function getNextRaceId() {                   // goes through the array state.sessions[]
  const next = state.sessions.find((session) => {   // and returns the first with status 'notStarted'
    return  session.status === 'notStarted';
  });
  return next ? next.id : null;
}

function getAllNotStartedRacesId() {           //REVIEW - not in use yet
  const allNextRaces = state.sessions.filter((session) => {
    return  session.status === 'notStarted';
  });
  return allNextRaces;
}

export function stateUptNextRaceId(id) {
    state.nextRace = id;
}

export function stateUptStartSession(session) {
    if (!session) {
        console.log("Updating state as per race start command failed, no session received for processing");
        return;
    }
    state.runningRace = session.id;
        console.log("state.raceMode enne: ",state.raceMode);
    state.raceMode = RACE_MODES.SAFE;
    session.startTime = Date.now();
    session.status = 'started';
    state.nextRace = getNextRaceId();
    state.leaderboard.push(...session.drivers);
    console.log("state.raceMode pärast: ",state.raceMode);
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
    state.leaderboard = [];
    state.nextRace = getNextRaceId();
}