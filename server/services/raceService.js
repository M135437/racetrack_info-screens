import EVENTS from "../../client/src/shared/events.js"
import state from "../state/state.js"
import {
  stateUptStartSession,
  stateUptChangeMode,
  stateUptFinishMode,
  stateUptEndSession
} from "../state/stateMachine.js"
import { startTimer, resetTimer } from "../state/timer.js"
import { RACE_MODES, PROTECTED_MODES, ACTIVE_MODES } from "../../client/src/shared/types.js"

function startSession(io) {
    // check that there is no overlapping active session in motion ("protected modes")
    // PROTECTED_MODES = ['notStarted', 'safe', 'danger', 'hazard', 'finish'];
    if (Object.values(PROTECTED_MODES).includes(state.raceMode)) { 
        io.emit(EVENTS.SESSION_ERROR, "Unable to start a new race - safety alert! Previous race has not ended gracefully!");
        return 1;
    }
    // take current timestampt and "select"(find) the session
    const startTime = Date.now();
    let session = state.sessions.find(s => s.id === state.currentRace);
    // update state and trigger timer processing
    stateUptStartSession(session); // set RACE_MODE.SAFE and increment state.nextRace
    resetTimer();
    startTimer(io)
    // emit io event to inform of session start
    io.emit(EVENTS.SESSION_STARTED, {
        startTime,
        raceId: state.currentRace,
        raceMode: RACE_MODES.SAFE
    });
}

function changeMode(io, mode) {
    if (state.raceMode !== RACE_MODES.FINISH) {  // a session already taken to 'finish' mode 
    // should not get let back to hazard nor danger mode as per requirements
    stateUptChangeMode(mode); 
    // any other checks this fuction should do before trusting to emit? REVIEW
    io.emit(EVENTS.SESSION_STARTED, {
        raceMode: state.raceMode
    });
    } else {
        // Once the race mode changes to "Finished", it cannot be changed to any other mode.
            // any control measures to take here? REVIEW
        // any other separate checks for changeMode to also avoid "RACE_MODES.SAFE"?
        // REVIEW&TEST - double-check that there is no option for raceMode === 'ended' and mode gets changed
    }
}

function finishMode(io) {
    stateUptFinishMode()

    io.emit(EVENTS.SESSION_MODE, {
        raceMode: RACE_MODES.FINISH
    });
}

function endSession(io) {
    stateUptEndSession()

    io.emit(EVENTS.SESSION_END, {
        raceMode: RACE_MODES.ENDED
    });
}

export default { startSession, changeMode, finishMode, endSession};