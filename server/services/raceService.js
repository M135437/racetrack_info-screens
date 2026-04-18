import EVENTS from "../../client/src/shared/events.js"
import state from "../state/state.js"
import {
  stateUptStartSession,
  stateUptChangeMode,
  stateUptFinishMode,
  stateUptEndSession
} from "../state/stateMachine.js"
import { startTimer, resetTimer, stopTimer } from "../state/timer.js"
import { RACE_MODES, PROTECTED_MODES, ACTIVE_MODES } from "../../client/src/shared/types.js"

function getTime(io) { // debug event (REVIEW)
    io.emit("get:time", {
        timeRemaining: state.timer.timeRemaining,
        startTime: state.timer.startTime
    })
}

function getFirstNotStartedSession() {
  for (let i = 0; i < state.sessions.length; i++) {
    if (state.sessions[i].status === 'notStarted') {
      return state.sessions[i];
    }
  }
  return null;
}


function startSession(io) {
    // check that there is no overlapping active session in motion ("protected modes")
    // PROTECTED_MODES = ['safe', 'danger', 'hazard', 'finish'];
    if (Object.values(PROTECTED_MODES).includes(state.raceMode)) {
        io.emit(EVENTS.SESSION_ERROR, "Unable to start a new race - safety alert! Previous race has not ended gracefully! Setting raceMode to 'safe' ");
        changeMode(io, PROTECTED_MODES.SAFE);
        return 1;
    }

    const session = getFirstNotStartedSession();
    // check if there are no sessions available with status 'notStarted'
    if (!session) {
        console.log("No notStarted sessions available");
        io.emit(EVENTS.SESSION_ERROR, "No upcoming sessions available, unable to start. Please contact the receptionist at the front desk.");
        return;
    }
    // take current timestampt
    const startTime = Date.now();
    // update state and trigger timer processing
    stateUptStartSession(session); // set RACE_MODE.SAFE and increment state.nextRace
    resetTimer();
    startTimer(io)
    // emit io event to inform of session start
    io.emit(EVENTS.SESSION_STARTED, {
        startTime,
        raceId: state.runningRace,
        raceMode: RACE_MODES.SAFE,
        leaderboard: state.leaderboard
    });
}

function changeMode(io, mode) {
    // a session already taken to 'finishing' or 'ended mode
    // should not allow let back to hazard nor danger mode as per requirements
    // should also not using changeMode if there is no no race running at the moment
    if (state.raceMode !== RACE_MODES.FINISH && state.RaceMode !== RACE_MODES.ENDED && (state.runningRace)) {
    stateUptChangeMode(mode);
    io.emit(EVENTS.MODE_CHANGED, state.raceMode);
    } else {
        console.log("Please check race status, invalid changeMode requested.")
    }
}

function finishMode(io) {
    // block an already ended race from being taken to state 'finishing'
    if (state.raceMode === RACE_MODES.ENDED) {return};
    stateUptFinishMode()
    io.emit(EVENTS.MODE_CHANGED, state.raceMode);
}

function endSession(io) {
    stateUptEndSession()
    io.emit(EVENTS.SESSION_ENDED, state.raceMode);
    stopTimer();
}

function distributeState(io) {
    io.emit(EVENTS.STATE_DISTRIBUTED, {
        runningRace: state.runningRace,
        raceMode: state.raceMode
    })
}

export default { startSession, changeMode, finishMode, endSession, getTime, distributeState};