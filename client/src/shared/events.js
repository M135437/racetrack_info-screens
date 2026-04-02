const EVENTS = {
    // UI (front-end triggered) events
    RACE_CREATE: "race:create",     // front desk asks to create race with racers
    RACE_START: "race:start",       // race control asks to starts race
    RACE_MODE: "race:mode",         // race control asks to changes flag (state.raceMode.${})
    RACE_FINISH: "race:finish",     // race control asks to set finish flag (state.raceMode.finish) and finishes race (state.races.${id} -> status:'finished')
    RACE_END: "race:endSession",    // race control asks to end session 

    // back-end recurring timer heartbeat
    TIMER_UPDATE: "timer:update",       // back-end heartbeat sends every timer update (as per config, example every second or every 1/4 of a second)
    // back-end (confirmed) events
    RACE_CREATED: "race:created",       // back-end confirms creation of new race set with racers
    RACE_STARTED: "race:started",       // back-end confirms race start to all screens
    MODE_CHANGE: "mode:change",         // back-end announced mode change
    RACE_FINISHED: "race:finished",     // back-end announces end of specific race
    SESSION_ENDED: "race:sessionEnded"  // back-end confirms end of session as per race control ask or if timer ran out and triggers end of racing session
}

export default EVENTS;