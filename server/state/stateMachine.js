import { ENV_VARIABLES } from "../config/env.js"
import state from "./state.js"
import { RACE_MODES } from "../../client/src/shared/types.js"

export function setDuration(RACE_DURATION) {
    state.timer.duration = RACE_DURATION;
}

// utility functions to support state update
export function getNextRaceId() {                   // goes through the array state.sessions[]
    const next = state.sessions.find((session) => {   // and returns the first with status 'notStarted'
        return session.status === 'notStarted';
    });
    return next ? next.id : null;
}

function getAllNotStartedRacesId() {           //REVIEW - not in use yet
    const allNextRaces = state.sessions.filter((session) => {
        return session.status === 'notStarted';
    });
    return allNextRaces;
}

export function stateUptNextRaceId(id) {
    state.nextRace = id;
}

export function stateUptStartSession(session) {
    if (!session) {
        console.log("Updating state as per race start command failed, no session received for processing");
        return;
    }
    state.runningRace = session.id;
    console.log("state.raceMode enne: ", state.raceMode);
    state.raceMode = RACE_MODES.SAFE;
    session.startTime = Date.now();
    session.status = 'started';
    state.nextRace = getNextRaceId();
    state.leaderboard.push(...session.drivers);
    console.log("state.raceMode pärast: ", state.raceMode);
}



export function stateUptChangeMode(mode) {
    state.raceMode = mode;
}

export function stateUptFinishMode(mode) {
    state.raceMode = RACE_MODES.FINISH;
}

export function stateUptEndSession() {
    state.raceMode = RACE_MODES.ENDED;
    state.runningRace = null;
    state.leaderboard = [];
    state.nextRace = getNextRaceId();
}

export function createSession(state, { name, startTime }) {

    if (!name || name.trim() === "") {
        throw new Error('Session name is required')
    }

    if (!startTime) {
        throw new Error('Start time is required')
    }

    const session = {
        id: Date.now(),
        name: name.trim(),
        startTime,

        maxSlots: 8,
        freeSlotsLeft: 8,
        status: 'notStarted',

        drivers: []
    }

    state.sessions.push(session)

    return session
}

export function addDriver(state, { sessionId, driverName, car }) {

    const session = state.sessions.find(s => s.id === sessionId)

    if (!session) {
        throw new Error("Session not found")
    }

    if (session.freeSlotsLeft <= 0) {
        throw new Error("No free slots left")
    }

    if (!driverName || driverName.trim() === "") {
        throw new Error("Driver name is required")
    }

    if (session.drivers.some(d => d.name === driverName)) {
        throw new Error("Driver with this name already exists")
    }

    const driver = {
        id: Date.now(),
        name: driverName.trim(),
        car: car || "—",
        lastLapTimestamp: null,
        lapCount: null,
        latestLapTime: null,
        currentLap: null,
        fastestLap: null,
        isFinished: false
    }

    session.drivers.push(driver)
    session.freeSlotsLeft--

    return driver
}

export function removeDriver(state, { sessionId, driverId }) {

    const session = state.sessions.find(s => s.id === sessionId)

    if (!session) {
        throw new Error("Session not found")
    }

    const initialLength = session.drivers.length

    session.drivers = session.drivers.filter(d => d.id !== driverId)

    if (session.drivers.length < initialLength) {
        session.freeSlotsLeft++
    }

    return { message: "Driver removed" }
}

export function deleteSession(state, { sessionId }) {

    const initialLength = state.sessions.length

    state.sessions = state.sessions.filter(s => s.id !== sessionId)

    if (state.sessions.length === initialLength) {
        throw new Error("Session not found")
    }

    return { message: `Session ${sessionId} deleted` }
}