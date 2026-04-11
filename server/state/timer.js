import state from "./state.js"
import EVENTS from "../../client/src/shared/events.js"

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
     //   console.log(`timer.js debug: timeRemaining was ${debugvalue}, now set to ${state.timer.timeRemaining}, start was at timestampt ${state.timer.startTime} (${new Date(state.timer.startTime).toLocaleString()}`) // REVIEW
        // REVIEW
        io.emit(EVENTS.TIMER_UPDATE, state.timer.timeRemaining);
        state.timer.timeRemaining--; // remove one interval unit (configured at end of this function)

        // stop condition
        if (state.timer.timeRemaining <= 0) {
            console.log("timer.js debug: timer ran out of time!")
            stopTimer();
        }
    }, 33) // REVIEW try with 66, 200, 1000 for performance variations
}

function stopTimer() {
    console.log("timer.js debug: stop() called, stopping timer"); // REVIEW
    clearInterval(state.timer.timerStatus);
    state.timer.timerStatus = null;
}

function resetTimer() {
    state.timer.timeRemaining = state.timer.duration; 
}

export { startTimer, stopTimer, resetTimer };