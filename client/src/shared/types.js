
// race modes
const RACE_MODES = {
    NOTSTARTED: 'notStarted',
    SAFE: 'safe',
    DANGER: 'danger',
    HAZARD: 'hazard',
    FINISH: 'finish',
    ENDED: 'ended'
}
const PROTECTED_MODES = {   // should not allow new race session to start 
    // during these intermediate modes - raceService.js is the protector
    SAFE: 'safe',
    DANGER: 'danger',
    HAZARD: 'hazard',
    FINISH: 'finish'
}

const ACTIVE_MODES = {
    SAFE: 'safe',
    DANGER: 'danger',
    HAZARD: 'hazard'
}

export { RACE_MODES, PROTECTED_MODES, ACTIVE_MODES }