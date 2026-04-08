import { ENV_VARIABLES } from "../config/env.js"
import state from "./state.js"

export function updatePort(RACE_DURATION) {
    state.timer.duration = RACE_DURATION;
}

