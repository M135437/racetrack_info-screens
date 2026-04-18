import state from "./state.js"
import EVENTS from "../../client/src/shared/events.js"
import raceService from "../services/raceService.js"

function startTimer(io) {
    if (state.timer.timerStatus) {
        console.log("Server(timer.js): timer seems to be already running - there is a value in state.timer.timerStatus that is not null")
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

export function correctTimeAfterStartup() {
        const elapsed = Date.now() - state.timer.startTime;
        state.timer.timeRemaining = state.timer.duration - elapsed; // see edge case description below and consider
    // add persistency logic for correcting state.timer.timeRemaining and possibly other date
    // consider edge case scenarios - crash took place when race was in dev mode (1min), but restarted with prod mode (10min) and vice versa -- duration may cause issues***
    // double-check for crash-caused errors and logic issues caused at state.timer.timerStatus
}

export { startTimer, stopTimer, resetTimer };