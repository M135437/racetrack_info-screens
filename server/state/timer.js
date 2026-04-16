import state from "./state.js"
import EVENTS from "../../client/src/shared/events.js"
import raceService from "../services/raceService.js"

//debub version //REVIEW
function startTimer(io) {
    //DEBUG
    console.log("timer.js debug: starting timer"); //REVIEW
    //console.log(`timer.js debug: timerStatus is ${state.timer.timerStatus} at start`) // REVIEW
    //check that timer is already not running
    if (state.timer.timerStatus) {
        console.log("timer.js debug: timer seems to be already running - there is a value in state.timer.timerStatus that is not null") // REVIEW
        // proper feedback to UI TBD //REVIEW
        return;
    }
    // update variables
    const debugvalue = JSON.stringify(state.timer.timeRemaining); // REVIEW
    state.timer.timeRemaining = state.timer.duration;
    state.timer.startTime = Date.now();
    // start timer
    state.timer.timerStatus = setInterval(() => {
        const elapsed = Date.now() - state.timer.startTime;
        state.timer.timeRemaining = state.timer.duration - elapsed;
        io.emit(EVENTS.TIMER_UPDATE, state.timer.timeRemaining);

        // stop condition
        if (state.timer.timeRemaining <= 0) {
            console.log("timer.js debug: timer ran out of time!")
            raceService.finishMode(io)
            resetTimer();
        }
    }, 100)
}

function stopTimer() {
    console.log("timer.js debug: stop() called, stopping timer"); // REVIEW
    clearInterval(state.timer.timerStatus);
    state.timer.timerStatus = null;
}

function resetTimer() {
    state.timer.timeRemaining = state.timer.duration;
    state.timer.startTime = null;
}

export { startTimer, stopTimer, resetTimer };