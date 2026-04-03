//in-memory session store
let sessions = []
let sessionIdCounter = 1

//defining session-model (id, name, drivers, cars, status)
function createSessionObject(name) {
    return {
        id: sessionIdCounter++,
        name,
        drivers: [],
        cars: [],
        status: 'pending' //later can be 'active' or 'completed'
    };
}

//core functions to manage sessions

//READ (GET) upcoming sessions
function getUpcomingSessions() {
    return sessions   //hiljem return sessions.filter(session => session.status === 'pending');
}

//CREATE (POST) session
function createSession(name) {
    //error handlers
    if (!name || name.trim() === "") {
        throw new Error('Session name is required and must be a string');
    }

    const session = createSessionObject(name);
    sessions.push(session);
    return session;
}


//DELETE session (maybe to be used for canceling a session before it starts, to think of replacing with race status change to 'canceled' or something similar)
function deleteSession(id) {
    sessions = sessions.filter(session => session.id !== id);
    return { message: `Session with id ${id} deleted successfully` };
}


//EXPORTING functions
export {
    getUpcomingSessions,
    createSession,
    deleteSession
}
