import { create } from "zustand";
import { socket } from "../socket/socket";
import EVENTS from "../shared/events";

let isListening = false;

export const useRaceState = create((set) => ({
    time: null,
    sessions: [],
    raceMode: 'notStarted',
    leaderboard: [],

    setTime: (time) => set({ time }),
    setSessions: (sessions) => set({ sessions }),
    setRaceMode: (raceMode) => set({ raceMode }),
    setLeaderboard: (leaderboard) => set({ leaderboard }),

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

        // sessioon algas — NextRace peab uuenema
        socket.on(EVENTS.SESSION_STARTED, () => {
            set({ raceMode: 'safe' });
            socket.emit(EVENTS.SESSION_GET);
        });

        // sessioon lõppes — NextRace paddock sõnum
        socket.on(EVENTS.SESSION_ENDED, () => {
            set({ raceMode: 'ended' });
            socket.emit(EVENTS.SESSION_GET);
        });

        // küsi kohe algandmed
        socket.emit(EVENTS.SESSION_GET);
    }
        
}));