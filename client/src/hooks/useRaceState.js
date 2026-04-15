import { create } from "zustand";
import { socket } from "../socket/socket";
import EVENTS from "../shared/events";

let isListening = false;

export const useRaceState = create((set) => ({
    time: null,
    sessions: [],
    raceMode: 'notStarted',
    runningRace: null,
    leaderboard: [],


    setTime: (time) => set({ time }),
    setSessions: (sessions) => set({ sessions }),
    setRaceMode: (raceMode) => set({ raceMode }),
    setRunningRace: (id) => set({ runningRace: id }),
    setLeaderboard: (leaderboard) => set({ leaderboard }),

    // EMIT LAP_UPDATE when lap is recorded in LapTracker
    recordLap: (sessionId, carId) => {
        console.log("Emitting LAP_UPDATE:", sessionId, carId);

        socket.emit(EVENTS.LAP_UPDATE, {
            sessionId,
            carId: carId
        });
    },

    listenSocket: () => {
        if (isListening) {
            console.log("Socket listeners already active");
            return;
        }

        isListening = true;
        console.log("Attaching socket listeners");

        // cleanup
        socket.off(EVENTS.TIMER_UPDATE);
        socket.off(EVENTS.SESSION_LISTED);
        socket.off(EVENTS.MODE_CHANGED);
        socket.off(EVENTS.LAP_UPDATED);
        socket.off(EVENTS.LAP_UPDATE);
        socket.off(EVENTS.SESSION_STARTED);
        socket.off(EVENTS.SESSION_ENDED);

        // taimer
        socket.on(EVENTS.TIMER_UPDATE, (ms) => {
            set({ time: ms });
        });

        // sessioonide nimekiri
        socket.on(EVENTS.SESSION_LISTED, (data) => {
            set({ sessions: Array.isArray(data) ? data : [] });
        });

        // režiimi muutus — flags, countdown, leaderboard vajavad seda
        socket.on(EVENTS.MODE_CHANGED, (newMode) => {
            set({ raceMode: newMode });
        });

        // ringiaegade uuendus — leaderboard vajab seda
        socket.on(EVENTS.LAP_UPDATED, (data) => {
            set({ leaderboard: Array.isArray(data) ? data : [] });
        });

        // 🔥 NEW PARTIAL UPDATE (leaderboard)
        socket.on(EVENTS.LAP_UPDATE, ({ sessionId, carId, ...updates }) => {
            set((state) => {

                if (!state.runningRace) {
                    console.warn("LAP_UPDATE ignored: no active race")
                    return state
                }

                const updatedSessions = state.sessions.map(session => {
                    if (session.id !== sessionId) return session;

                    return {
                        ...session,
                        cars: (session.cars || []).map(car => {
                            if (car.id !== carId) return car;
                            return { ...car, ...updates };
                        })
                    };
                });

                const updatedLeaderboard = state.leaderboard.map(car => {
                    if (car.id !== carId) return car;
                    return { ...car, ...updates };
                });

                return {
                    sessions: updatedSessions,
                    leaderboard: updatedLeaderboard
                };
            });
        });

        // sessioon algas — NextRace/RaceFlag/RaceControl/FrontDesk/LapTracker/Leaderboard peavad uuenema
        socket.on(EVENTS.SESSION_STARTED, (data) => {
            set({
                raceMode: 'safe',
                runningRace: data?.raceId ?? null,
                leaderboard: Array.isArray(data.leaderboard) ? data.leaderboard : []
            });
            socket.emit(EVENTS.SESSION_GET);
        });

        // sessioon lõppes — NextRace paddock sõnum
        socket.on(EVENTS.SESSION_ENDED, () => {
            set({
                raceMode: 'ended',
                runningRace: null
            });
            socket.emit(EVENTS.SESSION_GET);
        });

        // küsi kohe algandmed
        socket.emit(EVENTS.SESSION_GET);
    }

}));