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

function getTime(io) { // REVIEW - debug only
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
        io.emit(EVENTS.SESSION_ERROR, "No upcoming sessions");
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
    if (state.raceMode !== RACE_MODES.FINISH) {  // a session already taken to 'finish' mode
    // should not get let back to hazard nor danger mode as per requirements
    stateUptChangeMode(mode);
    // any other checks this fuction should do before trusting to emit? REVIEW
    io.emit(EVENTS.MODE_CHANGED, state.raceMode);
    } else {
        // Once the race mode changes to "Finished", it cannot be changed to any other mode.
            // any control measures to take here? REVIEW
        // any other separate checks for changeMode to also avoid "RACE_MODES.SAFE"?
        // REVIEW&TEST - double-check that there is no option for raceMode === 'ended' and mode gets changed
    }
}

function finishMode(io) {
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