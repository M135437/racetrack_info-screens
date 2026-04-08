// Socket adapter to abstract away socket event names and provide a clean API for the client
import { socket } from "./socket";
import EVENTS from "../shared/events";

// SERVER → CLIENT
const serverToClient = {
    "session:listed": EVENTS.SESSION_LIST,
    "session:created": EVENTS.SESSION_CREATED,
    "session:updated": EVENTS.SESSION_UPDATED,
    "session:deleted": EVENTS.SESSION_DELETED,
    "session:error": EVENTS.SESSION_ERROR
};

// CLIENT → SERVER
const clientToServer = {
    [EVENTS.SESSION_GET]: "session:get",
    [EVENTS.SESSION_CREATE]: "session:create",
    [EVENTS.SESSION_DELETE]: "session:delete",
    [EVENTS.SESSION_READY]: "session:ready",
    [EVENTS.DRIVER_ADD]: "driver:add"
};

// LISTEN
export const onEvent = (event, handler) => {
    const serverEvent = Object.keys(serverToClient)
        .find(key => serverToClient[key] === event);

    console.log("👂 listen:", event, "→", serverEvent)

    if (!serverEvent) {
        console.warn("❌ No mapping for:", event);
        return;
    }

    socket.on(serverEvent, handler);
};

// EMIT
export const emitEvent = (event, payload) => {
    const serverEvent = clientToServer[event]

    console.log("🚀 EMIT:", event, "→", serverEvent)

    if (!serverEvent) {
        console.warn("❌ No mapping for:", event)
        return
    }

    socket.emit(serverEvent, payload) //payload võib olla tühi, näiteks SESSION_GET puhul
};