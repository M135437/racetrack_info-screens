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
    return stateMachine.deleteSession(state, {
        sessionId: id
    })
}


//CARS (ex-drivers) management
function addCar(sessionId, name, car) {
    return stateMachine.addCar(state, {
        sessionId,
        name,
        car
    })
}

function removeCar(sessionId, carId) {
    return stateMachine.removeCar(state, {
        sessionId,
        carId
    })
}

function updateCar(sessionId, carId, updates) {
    return stateMachine.updateCar(state, {
        sessionId,
        carId,
        ...updates
    })
}


//EXPORTING functions
export {
    getUpcomingSessions,
    getAllSessions,
    createSession,
    deleteSession,
    addCar,
    removeCar,
    updateCar
}