// sessionHandlers.js - handles session-related socket events
import EVENTS from "../events.js";
import {
    createSession,
    getSessions,
    deleteSession,
    addDriver,
    markReady
} from "../state/sessionStore.js";

export const registerSessionHandlers = (io, socket) => {

    /* socket.on(EVENTS.SESSION_GET, () => {
         socket.emit(EVENTS.SESSION_LISTED, getSessions());
     });*/

    socket.on(EVENTS.SESSION_GET, () => {
        console.log("📥 SESSION_GET received")

        const data = getSessions()

        console.log("📤 sending sessions:", data)

        socket.emit(EVENTS.SESSION_LISTED, data)
    }) //ajutine testimiseks, et näha, kas üldse töötab, ja et näha, mis andmeid serveris on


    socket.on(EVENTS.SESSION_CREATE, ({ name }) => {
        const session = createSession(name); //createSession() loob uue sessiooni ja tagastab selle, mis sisaldab juba ID-d
        const sessions = getSessions() //saame uuendatud sessioonide nimekirja, mis sisaldab nüüd ka uut sessiooni
        io.emit(EVENTS.SESSION_LISTED, sessions)//emit updated session list to all clients (could be optimized to emit only to clients that need it, but for simplicity emitting to all)
    });

    socket.on(EVENTS.SESSION_DELETE, ({ id }) => {
        deleteSession(id);
        io.emit(EVENTS.SESSION_DELETED, { id });
    });

    socket.on(EVENTS.DRIVER_ADD, ({ sessionId, driver }) => {
        const updated = addDriver(sessionId, driver);
        const sessions = getSessions();

        io.emit(EVENTS.SESSION_LISTED, sessions);
    });

    socket.on(EVENTS.SESSION_READY, ({ id }) => {
        const updated = markReady(id);
        io.emit(EVENTS.SESSION_UPDATED, updated);
    });
};