import state from "../state/state.js"
import * as stateMachine from "../state/stateMachine.js"

//in-memory pointer to sessions in state
let sessions = state.sessions;


//core functions to manage sessions

//READ (GET) upcoming sessions
function getUpcomingSessions() {
    return state.sessions.filter(session => session.status === 'notStarted');
}

//READ (GET) all sessions
function getAllSessions() {
    return state.sessions;
}

//CREATE (POST) session
function createSession(name, startTime) {
    console.log("doing createSession(name, startTime)")

    const session = stateMachine.createSession(state, {
        name,
        startTime
    })

    stateMachine.stateUptNextRaceId(session.id)

    return session
}


//DELETE session (maybe to be used for canceling a session before it starts, to think of replacing with race status change to 'canceled' or something similar)
//now it does not check if session exists, just filters out the session with the given id, can be improved to return error if session with given id does not exist
function deleteSession(id) {
    state.sessions = state.sessions.filter(session => session.id !== id);
    return { message: `Session with id ${id} deleted successfully` };
}


//ADD driver to session (not implemented yet, but can be added later when implementing driver management)
function addDriver(sessionId, driverName, car) {
    return stateMachine.addDriver(state, {
        sessionId,
        driverName,
        car
    })
}


//remove driver from session (not implemented yet, but can be added later when implementing driver management)
function removeDriver(sessionId, driverId) {
    return stateMachine.removeDriver(state, {
        sessionId,
        driverId
    })
}

function updateDriver(sessionId, driverId, name, car) {
    const session = state.sessions.find(s => s.id === sessionId)

    if (!session) {
        throw new Error("Session not found")
    }

    const driver = session.drivers.find(d => d.id === driverId)

    if (!driver) {
        throw new Error("Driver not found")
    }

    // update driver info if new values are provided, 
    // otherwise keep existing values
    if (typeof name === "string" && name.trim() !== "") {
        driver.name = name.trim()
    }

    if (typeof car === "string" && car.trim() !== "") {
        driver.car = car.trim()
    }

    return driver
}


//EXPORTING functions
export {
    getUpcomingSessions,
    getAllSessions,
    createSession,
    deleteSession,
    addDriver,
    removeDriver,
    updateDriver
}