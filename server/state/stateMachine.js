import { ENV_VARIABLES } from "../config/env.js"
import state from "/server/state/state.js"

export function updatePort(RACE_DURATION) {
    state.timer.duration = RACE_DURATION;
}

