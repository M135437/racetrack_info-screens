import EVENTS from "../../client/src/shared/events.js"
import state from "../state/state.js"
import { startTimer, resetTimer } from "../state/timer.js"
import { RACE_MODES, PROTECTED_MODES, ACTIVE_MODES } from "../../client/src/shared/types.js"

function startSession(io) {
    if (Object.values(PROTECTED_MODES).includes(state.raceMode)) { 
        io.emit(EVENTS.SESSION_ERROR, {
            // inform front-end that they cannot start a new race until
            // race-control has gracefully ended previous session
            // PROTECTED_MODES = ['notStarted', 'safe', 'danger', 'hazard', 'finish'];
        });
        return 1;
    }
    // variable / state update
    const startTime = Date.now();
    let session = state.sessions.find(s => s.id === state.currentRace);
    state.nextRace = +state.currentRace +1;
    session.startTime = startTime; // REVIEW -- vt Olga oksast, kuidas session mgmt käib - kas läbi state.currentRace.startTime vmuud moodi
    // endtime - currently out of use // REVIEW
    session.status = 'started';
    state.raceMode = RACE_MODES.SAFE;
    // trigger timer processing
    resetTimer();
    startTimer(io)
    // emit io event for session start
    io.emit(EVENTS.SESSION_STARTED, {
        startTime,
        raceId: state.currentRace,
        raceMode: RACE_MODES.SAFE
    });
}

function changeMode(io, mode) {

    if (state.raceMode !== RACE_MODES.FINISH) {  // a session already taken to 'finish' mode 
    // should not get let back to hazard nor danger mode as per requirements
    state.raceMode = mode;
    // any other checks this fuction should do before trusting to emit? REVIEW
    io.emit(EVENTS.SESSION_STARTED, {
        raceMode: 'mode'
    });
    } else {
        // Once the race mode changes to "Finished", it cannot be changed to any other mode.
            // any control measures to take here? REVIEW
    }
}

function finishMode(io) {
    state.raceMode = RACE_MODES.FINISH;
    // any other checks this fuction should do before trusting to emit? REVIEW
    io.emit(EVENTS.SESSION_MODE, {
        raceMode: RACE_MODES.FINISH
    });
}

function endSession(io) {
    state.raceMode = RACE_MODES.ENDED;
    // this should prevent further lap-time buttons to be clicked
        // anything this should block for DEV3-lapService?
    // any other checks this fuction should do before trusting to emit? REVIEW
    io.emit(EVENTS.SESSION_END, {
        raceMode: RACE_MODES.ENDED
    });
}

export default { startSession, changeMode, finishMode, endSession};