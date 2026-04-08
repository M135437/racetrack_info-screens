import crypto from "crypto";

export const sessions = [];

export const createSession = (name) => {
    const session = {
        id: crypto.randomUUID(),
        name,
        status: "draft",
        drivers: []
    };

    sessions.push(session);
    return session;
};

export const getSessions = () => sessions;

export const deleteSession = (id) => {
    const index = sessions.findIndex(s => s.id === id);
    if (index !== -1) {
        sessions.splice(index, 1);
    }
};

export const addDriver = (sessionId, driver) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    session.drivers.push({
        id: crypto.randomUUID(),
        ...driver
    });

    return session;
};

export const markReady = (id) => {
    const session = sessions.find(s => s.id === id);
    if (!session) return;

    session.status = "ready";
    return session;
};