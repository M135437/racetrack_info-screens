import state from "../state/state.js"
import * as stateMachine from "../state/stateMachine.js"

//in-memory pointer to sessions in state
let sessions = state.sessions;

function getLastNotStartedSession() {
  for (let i = state.sessions.length - 1; i >= 0; i--) {
    if (state.sessions[i].status === 'notStarted') {
      return state.sessions[i];
    }
  }
  return null;
}

//defining session-model (id, name, drivers, cars, status)
function createSessionObject(name, startTime) {
    return {
        id: (state.sessions.length),
        name,
        startTime: startTime,
        maxSlots: 8, //default value, can be changed when creating session
        freeSlotsLeft: 8, //default value, can be changed when drivers join
        status: 'notStarted', //later can be 'started', 'finishing' or 'ended'

        drivers: [], //array of driver objects {id, name, car}
    };
}

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
    //error handlers
    if (!name || name.trim() === "") {
        throw new Error('Session name is required');
        console.log("name error")
    }
    if (!startTime) {
        throw new Error('Start time is required');
        console.log("starttime error")
    }

    const session = createSessionObject(name, startTime);
    state.sessions.push(session);
    const last = getLastNotStartedSession();
    if (!last) {
        console.log("No notStarted sessions found");
        return session;
    }
    stateMachine.stateUptNextRaceId(last.id);
    return session;
}


//DELETE session (maybe to be used for canceling a session before it starts, to think of replacing with race status change to 'canceled' or something similar)
//now it does not check if session exists, just filters out the session with the given id, can be improved to return error if session with given id does not exist
function deleteSession(id) {
    state.sessions = state.sessions.filter(session => session.id !== id);
    return { message: `Session with id ${id} deleted successfully` };
}


//ADD driver to session (not implemented yet, but can be added later when implementing driver management)
function addDriver(sessionId, driverName, car) {
    const session = state.sessions.find(s => s.id === sessionId) //

    if (!session) {
        throw new Error("Session not found")
    }

    if (session.freeSlotsLeft <= 0) {
        throw new Error("No free slots left")
    }

    if (!driverName || driverName.trim() === "") {
        throw new Error("Driver name is required")
    }

    // prevent adding drivers with duplicate names in the same session, can be improved to allow duplicates if needed, but for now it will just throw an error if a driver with the same name already exists in the session
    if (session.drivers.some(d => d.name === driverName)) {
        throw new Error("Driver with this name already exists")
    }

    const driver = {
        id: Date.now(), // simple unique id generator, can be improved to use a better method for generating unique ids
        name: driverName,
        car: car || "—"
    }

    session.drivers.push(driver) // add driver to session's drivers array
    session.freeSlotsLeft-- // decrease free slots left by 1

    return driver
}


//remove driver from session (not implemented yet, but can be added later when implementing driver management)
function removeDriver(sessionId, driverId) {
    const session = state.sessions.find(s => s.id === sessionId) // find session by id

    if (!session) {
        throw new Error("Session not found")
    }

    const initialLength = session.drivers.length

    session.drivers = session.drivers.filter(d => d.id !== driverId) // remove driver from session's drivers array 
    // by filtering out the driver with the given id

    if (session.drivers.length < initialLength) {
        session.freeSlotsLeft++
    }

    return { message: "Driver removed" }
}


//EXPORTING functions
export {
    getUpcomingSessions,
    getAllSessions,
    createSession,
    deleteSession,
    addDriver,
    removeDriver
}