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


function addDriver(sessionId, driverName, car) {
    const session = state.sessions.find(s => s.id === sessionId);
    if (!session) throw new Error("Session not found");

    // 1. Teisendame sissetuleva auto numbriks
    let carNumber = car ? Number(car) : null;

    // 2. Kontrollime, kas sisestati tekst (nt "kiire auto")
    if (car && isNaN(carNumber)) {
        throw new Error("Auto number peab olema number, mitte tekst!");
    }

    // automatic car assignment logic (kui auto number on null, siis leiame esimese vaba auto numbriga 1 kuni maxSlots)

    // Võtame kõik numbrid, mis on JUBA võetud
    const takenCars = session.drivers.map(d => Number(d.car));

    if (carNumber === null) {
        // Kui kasutaja EI valinud autot, leiame esimese vaba vahemikus 1 kuni maxSlots
        for (let i = 1; i <= session.maxSlots; i++) {
            if (!takenCars.includes(i)) {
                carNumber = i;
                break; // Leidsime esimese vaba, lõpetame otsimise
            }
        }
    } else {
        // Kui kasutaja ISE valis auto, kontrollime, kas see on vaba
        if (takenCars.includes(carNumber)) {
            throw new Error(`Auto number ${carNumber} on juba kasutusel!`);
        }
    }

    // Kui ikka pole carNumber-it (nt kõik kohad on täis), viskame vea
    if (carNumber === null) {
        throw new Error("Vabu autosid ei ole saadaval!");
    }

    // auto number on nüüd kindlalt olemas ja kontrollitud, et see on vaba. Jätkame sõitja loomisega.

    // 3. Nime puhastus ja kontroll (see osa jääb samaks)
    const cleanName = driverName ? driverName.trim() : "";
    if (cleanName === "") throw new Error("Driver name is required");

    const alreadyExists = session.drivers.some(d =>
        d.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (alreadyExists) throw new Error(`Sõitja "${cleanName}" on juba nimekirjas!`);

    if (session.freeSlotsLeft <= 0) throw new Error("No free slots left");

    // 4. Loome sõitja
    const driver = {
        id: Date.now() + Math.random(),
        name: cleanName,
        car: carNumber, // See on nüüd alati number, kas käsitsi valitud või automaatne
        lastLapTimestamp: null,
        lapCount: null,
        latestLapTime: null,
        currentLap: null,
        fastestLap: null,
        isFinished: false
    };

    session.drivers.push(driver);
    session.freeSlotsLeft--;

    console.log(`EDUKAS: Sõitja ${cleanName} lisatud. Auto: ${carNumber}`);
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