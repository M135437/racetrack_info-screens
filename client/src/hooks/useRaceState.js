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
    setLeaderboard: (leaderboard) => set({ leaderboard }),


    recordLap: (carId) => {
        console.log("Emitting LAP_UPDATE for car:", carId);
        socket.emit(EVENTS.LAP_UPDATE, carId);
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
        socket.off(EVENTS.SESSION_STARTED);
        socket.off(EVENTS.SESSION_ENDED);
        socket.off(EVENTS.STATE_DISTRIBUTED);

        // taimer
        socket.on(EVENTS.TIMER_UPDATE, (ms) => {
            set({ time: ms });
        });

        // sessioonide nimekiri
        socket.on(EVENTS.SESSION_LISTED, (data) => {
            set({ sessions: Array.isArray(data) ? data : [] });
        });

        // Puhastame vana kuulari (hea tava)
        socket.off(EVENTS.SESSION_ERROR);

        // Kuulame veateateid backendist
        socket.on(EVENTS.SESSION_ERROR, (errorMessage) => {
            console.error("BACKEND ERROR:", errorMessage);
            // alerti kasutan frontdeskis, kuna seal on võimalik sessioonide nimekirja muuta ja see võib põhjustada vigu, mida on vaja kasutajale näidata
            alert(`Hoiatus: ${errorMessage}`);
        });

        // listen for state distribution
        socket.on(EVENTS.STATE_DISTRIBUTED, (data) => {
            set({
                raceMode: data?.raceMode || 'notStarted',
                runningRace: data?.runningRace ?? null
            })
        })

        // režiimi muutus — flags, countdown, leaderboard vajavad seda
        socket.on(EVENTS.MODE_CHANGED, (newMode) => {
            set({ raceMode: newMode });
        });

        // ringiaegade uuendus — leaderboard vajab seda
        socket.on(EVENTS.LAP_UPDATED, (data) => {
            set({ leaderboard: Array.isArray(data) ? data : [] });
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
        socket.emit(EVENTS.STATE_GET);
    }

}));