import state from "./state.js"
import EVENTS from "../../client/src/shared/events.js"
import raceService from "../services/raceService.js"

//debub version //REVIEW
function startTimer(io) {
    if (state.timer.timerStatus) {
        console.log("timer.js: timer seems to be already running - there is a value in state.timer.timerStatus that is not null")
        return;
    }
    console.log("timer.js: timer started");
    // update variables
    state.timer.timeRemaining = state.timer.duration;
    state.timer.startTime = Date.now();
    // start timer
    state.timer.timerStatus = setInterval(() => {
        const elapsed = Date.now() - state.timer.startTime;
        state.timer.timeRemaining = state.timer.duration - elapsed;
        io.emit(EVENTS.TIMER_UPDATE, state.timer.timeRemaining);

        // stop condition
        if (state.timer.timeRemaining <= 0) {
            console.log("timer.js: timer ran out of time!")
            raceService.finishMode(io)
            resetTimer();
            return;
        }
    }, 100)
}

function stopTimer() {
    console.log("timer.js: stopTimer() called");
    clearInterval(state.timer.timerStatus);
    state.timer.timerStatus = null;
}

function resetTimer() {
    console.log("timer.js: resetTimer() called");
    clearInterval(state.timer.timerStatus)
    state.timer.timerStatus = null;

    state.timer.timeRemaining = state.timer.duration;
    state.timer.startTime = null;
}

export { startTimer, stopTimer, resetTimer };