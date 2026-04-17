import state from "../state/state.js"
import * as stateMachine from "../state/stateMachine.js"

//in-memory pointer to sessions in state
let sessionCounter = 1;

function getLastNotStartedSession() {
    for (let i = state.sessions.length - 1; i >= 0; i--) {
        if (state.sessions[i].status === 'notStarted') {
            return state.sessions[i];
        }
    }
    return null;
}

//defining session-model (id, name, drivers, cars, status)
function createSessionObject(name) {
    return {
        id: sessionCounter++,
        name,
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
function createSession(name) {
    console.log("doing createSession(name)")
    //error handlers
    if (!name || name.trim() === "") {
        throw new Error('Session name is required');
        console.log("name error")
    }

    const session = createSessionObject(name);
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


//ADD driver to session (not implemented yet, but can be added later 
// when implementing driver management)
function addDriver(sessionId, driverName, car) {
    // 1. Leiame sessiooni
    const session = state.sessions.find(s => s.id === sessionId)

    if (!session) {
        throw new Error("Session not found")
    }

    // 2. DEBUG LOGI - Et näha, mitu korda funktsioon käivitub
    console.log(`--- addDriver käivitus nimega: "${driverName}" ---`);

    // 3. PUHASTAME NIMEE (eemaldame tühikud)
    const cleanName = driverName ? driverName.trim() : "";

    if (cleanName === "") {
        throw new Error("Driver name is required")
    }

    // 4. TURVAMEES: Kontrollime, kas see nimi on juba sessioonis
    // Lisasin .toLowerCase(), et "Mikk" ja "mikk" oleksid sama asi
    const alreadyExists = session.drivers.some(d =>
        d.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (alreadyExists) {
        console.log(`BLOKEERITUD: Sõitja ${cleanName} on juba olemas.`);
        // RETURN asemel kasuta THROW, kui tahad, et frontend saaks veateate
        throw new Error(`Sõitja nimega "${cleanName}" on juba nimekirjas!`);
    }

    if (session.freeSlotsLeft <= 0) {
        throw new Error("No free slots left")
    }

    // 5. LOOME SÕITJA (id-le lisame suvalise numbri, et vältida kokkupõrkeid)
    const driver = {
        id: Date.now() + Math.random(),
        name: cleanName,
        car: car || "—",
        lastLapTimestamp: null,
        lapCount: null,
        latestLapTime: null,
        currentLap: null,
        fastestLap: null,
        isFinished: false
    }

    // 6. LISAME NIMEKIRJA
    session.drivers.push(driver)
    session.freeSlotsLeft--

    console.log(`EDUKAS: Sõitja ${cleanName} lisatud. Kokku nüüd: ${session.drivers.length}`);

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