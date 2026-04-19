const EVENTS = {
    // UI (front-end triggered) actions (requests to create an event, flow from UI to -> back-end)
    SESSION_CREATE: "session:create",   // front desk asks to create race with racers
    SESSION_DELETE: "session:delete",       // front desk asks for the server to create a session
    SESSION_GET: "session:get",             // front desk ask for the server for the current list of sessions when the component mounts
    SESSION_ERROR: "session:error",     //  front desk error handling
    SESSION_START: "session:start",     // race control asks to starts race (=flag to 'safe')
    SESSION_MODE: "session:mode",       // race control asks to changes flag (state.raceMode.${})
    SESSION_FINISH: "session:finish",   // race control asks to set finish flag (state.raceMode.finish) and finishes race (state.races.${id} -> status:'finished')
    SESSION_END: "session:endSession",  // race control asks to end session
    STATE_GET: "state:get",             // race control asks for state
    AUTH_ATTEMPT: "auth:attempt",       // app asks for authentication

    DRIVER_ADD: "driver:add",
    DRIVER_REMOVE: "driver:remove",
    DRIVER_UPDATE: "driver:update",

    LAP_INIT: "lap:init",                 // lap tracker initialization || laptracker dev and debug helper
    LAP_UPDATE: "lap:update",             // lap tracker asks to update lap time

    // back-end recurring timer heartbeat
    TIMER_UPDATE: "timer:update",       // back-end heartbeat sends every timer update (as per config, example every second or every 1/4 of a second)

    // back-end (confirmed) events (confirmed requests are turned to events, flow from back-end to -> UI & also changes state at back-end)
    SESSION_CREATED: "session:created",         // back-end confirms creation of new race set with racers
    SESSION_LISTED: "session:listed",           // back-end updates list of session
    SESSION_STARTED: "session:started",         // back-end confirms race start to all screens
    MODE_CHANGED: "mode:changed",               // back-end announced mode change
    SESSION_FINISHED: "session:finished",       // back-end announces end of specific race
    SESSION_ENDED: "session:sessionEnded",      // back-end confirms end of session as per race control ask or if timer ran out and triggers end of racing session

    LAP_UPDATED: "lap:updated",                 // back-end confirms lap update as having been recorded and publishes new time
    STATE_DISTRIBUTED: "state:distributed",     // back-end distributes state
    AUTH_RESPONDED: "auth:responded"            // back-end responds to authentication
}

export default EVENTS;