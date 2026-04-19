import state from "./state.js"
import EVENTS from "../../client/src/shared/events.js"
import raceService from "../services/raceService.js"

function startTimer(io) {
    if (state.timer.timerStatus) return; // timer is already running, do not start another one
    console.log("timer.js: startTimer() called");


    /*{
        console.log("Server(timer.js): timer seems to be already running - there is a value in state.timer.timerStatus that is not null")
        return;
       
    console.log("timer.js: timer started"); */

    if (!state.timer.startTime) {
        state.timer.startTime = Date.now(); // set start time if it hasn't been set yet
        state.timer.timeRemaining = state.timer.duration; // initialize timeRemaining to duration if startTime was not previously set
    }

    state.timer.timerStatus = setInterval(() => {

        // If startTime is not set, it means the timer has not been properly initialized, so we should not proceed with the timer logic. 
        // This check prevents potential errors that could arise from trying to calculate elapsed time without a valid start time.
        if (!state.timer.startTime) return; // if startTime is not set, do not proceed with timer logic
        const elapsed = Date.now() - state.timer.startTime; // calculate elapsed time since timer was started
        state.timer.timeRemaining = state.timer.duration - elapsed;

        io.emit(EVENTS.TIMER_UPDATE, state.timer.timeRemaining); // emit timer update to clients

        // If timeRemaining is less than or equal to 0, it means the timer has run out. In this case, we should call the finishMode function
        if (state.timer.timeRemaining <= 0) {
            raceService.finishMode(io); // call finishMode when timer runs out
            resetTimer(); // reset timer after finishing mode
        }
    }, 100); // update timer every 100ms
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

export function correctTimeAfterStartup(io) {
    //
    if (!state.timer.startTime) {
        state.timer.timeRemaining = state.timer.duration; // if there is no startTime, it means there is no active timer, so we can simply set timeRemaining to duration and return
        return;
    }

    const elapsed = Date.now() - state.timer.startTime; // calculate elapsed time since timer was started
    const remaining = state.timer.duration - elapsed; // see edge case description below and consider

    state.timer.timeRemaining = Math.max(0, remaining); // update timeRemaining, ensuring it doesn't go negative

    // If the timer was running before the server restarted and there is still time remaining, restart the timer
    if (state.timer.timeRemaining > 0) {
        startTimer(io);
    }


    // add persistency logic for correcting state.timer.timeRemaining and possibly other date
    // consider edge case scenarios - crash took place when race was in dev mode (1min), but restarted with prod mode (10min) and vice versa -- duration may cause issues***
    // double-check for crash-caused errors and logic issues caused at state.timer.timerStatus
}

export { startTimer, stopTimer, resetTimer };