import state from "../state/state.js"
import * as stateMachine from "../state/stateMachine.js"

//in-memory pointer to sessions in state
let sessionCounter = 1;

function getFirstNotStartedSession() {
    for (let i = 0; i < state.sessions.length; i++) {
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
    const first = getFirstNotStartedSession();
    if (!first) {
        console.log("No notStarted sessions found");
        return session;
    }
    stateMachine.stateUptNextRaceId(first.id);
    return session;
}


//DELETE session (maybe to be used for canceling a session before it starts, to think of replacing with race status change to 'canceled' or something similar)
//now it does not check if session exists, just filters out the session with the given id, can be improved to return error if session with given id does not exist
function deleteSession(id) {
    state.sessions = state.sessions.filter(session => session.id !== id);
    return { message: `Session with id ${id} deleted successfully` };
}


function addDriver(sessionId, driverName, car) {
    const session = state.sessions.find(s => s.id === sessionId);
    if (!session) throw new Error("Session not found");

    // 1. KONTROLL: Kas kohti on üldse vaba?
    if (session.freeSlotsLeft <= 0) {
        throw new Error("Sellesse sõitu rohkem sõitjaid ei mahu (kohtade arv täis)!");
    }

    // 2. Nime puhastus ja kontroll
    const cleanName = driverName ? driverName.trim() : "";
    if (cleanName === "") throw new Error("Driver name is required");

    if (session.drivers.some(d => d.name.toLowerCase() === cleanName.toLowerCase())) {
        throw new Error(`Sõitja "${cleanName}" on juba nimekirjas!`);
    }

    // 3. Auto numbri "tark" loogika
    let carNumber = car ? Number(car) : null;
    const takenCars = session.drivers.map(d => Number(d.car));

    // Kas sisestatud auto on vigane või juba võetud?
    const isCarInvalid = car && isNaN(carNumber);
    const isCarTaken = carNumber !== null && takenCars.includes(carNumber);

    // Kui auto on puudu, vigane või võetud, leiame automaatselt esimese vaba
    if (carNumber === null || isCarInvalid || isCarTaken) {
        let found = false;
        // Me kasutame session.maxSlots, et otsida vaba numbrit vahemikus 1-8
        for (let i = 1; i <= session.maxSlots; i++) {
            if (!takenCars.includes(i)) {
                carNumber = i;
                found = true;
                break;
            }
        }

        if (!found) {
            // See viga tekib siis, kui maxSlots on täis, aga mingil põhjusel freeSlotsLeft seda ei püüdnud
            throw new Error("Vabu auto numbreid ei leitud!");
        }

        if (isCarTaken) {
            console.log(`INFO: Auto ${car} oli hõivatud. Sõitjale ${cleanName} määrati automaatselt vaba auto: ${carNumber}`);
        }
    }

    // 4. Loome sõitja objekti
    const driver = {
        id: Date.now() + Math.random(),
        name: cleanName,
        car: carNumber,
        lastLapTimestamp: null,
        lapCount: null,
        latestLapTime: null,
        currentLap: null,
        fastestLap: null,
        isFinished: false
    };

    // 5. Salvestame
    session.drivers.push(driver);
    session.freeSlotsLeft--;

    console.log(`EDUKAS: ${cleanName} (Auto: ${carNumber}) lisatud. Vabu kohti: ${session.freeSlotsLeft}`);

    return driver;
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
    const session = state.sessions.find(s => s.id === sessionId);
    if (!session) throw new Error("Session not found");

    const driver = session.drivers.find(d => d.id === driverId);
    if (!driver) throw new Error("Driver not found");

    if (typeof name === "string" && name.trim() !== "") {
        driver.name = name.trim();
    }

    // Muudame sissetuleva auto teksti numbriks
    if (car !== undefined && car !== null) {
        const newCarNum = Number(car);
        if (!isNaN(newCarNum)) {
            driver.car = newCarNum;
        }
    }

    return driver;
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