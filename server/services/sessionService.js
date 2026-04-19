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

function createSessionObject(name) {
    return {
        id: sessionCounter++,
        name,
        maxSlots: 8,
        freeSlotsLeft: 8,
        status: 'notStarted',

        drivers: [], //array of driver objects {id, name, car}
    };
}


function getUpcomingSessions() {
    return state.sessions.filter(session => session.status === 'notStarted');
}

function getAllSessions() {
    return state.sessions;
}

function createSession(name) {
    console.log("doing createSession(name)")
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

function deleteSession(id) {
    state.sessions = state.sessions.filter(session => session.id !== id);
    return { message: `Session with id ${id} deleted successfully` };
}

function addDriver(sessionId, driverName, car) {
    const session = state.sessions.find(s => s.id === sessionId);
    if (!session) throw new Error("Session not found");

    // 1. Check: are there free slots left in the session?
    if (session.freeSlotsLeft <= 0) {
        throw new Error("Sellesse sõitu rohkem sõitjaid ei mahu (kohtade arv täis)!");
    }

    // 2. Check: is the driver name valid and not already taken in this session?
    const cleanName = driverName ? driverName.trim() : "";
    if (cleanName === "") throw new Error("Driver name is required");

    if (session.drivers.some(d => d.name.toLowerCase() === cleanName.toLowerCase())) {
        throw new Error(`Sõitja "${cleanName}" on juba nimekirjas!`);
    }

    // 3. Car number handling: 
    // if car is provided, try to use it; if it's invalid or taken, assign the first available number automatically
    let carNumber = car ? Number(car) : null;
    const takenCars = session.drivers.map(d => Number(d.car));

    // If car number is provided but invalid (not a number) or already taken, we will find the first available car number automatically
    const isCarInvalid = car && isNaN(carNumber);
    const isCarTaken = carNumber !== null && takenCars.includes(carNumber);

    // If the provided car number is invalid or taken, we need to assign the first available car number automatically
    if (carNumber === null || isCarInvalid || isCarTaken) {
        let found = false;
        // We will look for the first available car number starting from 1 up to maxSlots
        for (let i = 1; i <= session.maxSlots; i++) {
            if (!takenCars.includes(i)) {
                carNumber = i;
                found = true;
                break;
            }
        }


    }

    // 4. Create the driver object
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

    // 5. Add the driver to the session and decrease free slots
    session.drivers.push(driver);
    session.freeSlotsLeft--;

    return driver;
}

function removeDriver(sessionId, driverId) {
    const session = state.sessions.find(s => s.id === sessionId)

    if (!session) {
        throw new Error("Session not found")
    }

    const initialLength = session.drivers.length

    // Remove the driver from the session's drivers array by filtering out the driver with the given id
    session.drivers = session.drivers.filter(d => d.id !== driverId)

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

    // Car number handling: if a new car number is provided, we need to check if it's valid and not already taken by another driver in the same session
    if (car !== undefined && car !== null) {
        const newCarNum = Number(car);
        if (!isNaN(newCarNum)) {
            driver.car = newCarNum;
        }
    }

    return driver;
}


export {
    getUpcomingSessions,
    getAllSessions,
    createSession,
    deleteSession,
    addDriver,
    removeDriver,
    updateDriver
}