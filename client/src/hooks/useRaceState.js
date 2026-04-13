import { create } from "zustand";
import { socket } from "../socket/socket";
import EVENTS from "../shared/events";

// 🔒 private flag (ei kuulu React state’i)
let isListening = false;

export const useRaceState = create((set) => ({
    time: null,
    sessions: [],

    // setters for (re-) setting values
    setTime: (time) => set({ time }),
    setSessions: (sessions) => set({ sessions }),

    // scoket
    listenSocket: () => {
        // protect from attaching sockets twice
        if (isListening) {
            console.log("Socket listeners already active");
            return;
        }

        isListening = true;
        console.log("Attaching socket listeners");

        // cleanup (protect from hot reload bugs)
        socket.off(EVENTS.TIMER_UPDATE);
        socket.off(EVENTS.SESSION_LISTED);

        // listen: "timer:update"
        socket.on(EVENTS.TIMER_UPDATE, (ms) => {
            set({ time: ms });
        });

        // listen: "session:listed"
        socket.on(EVENTS.SESSION_LISTED, (data) => {
            set({ sessions: Array.isArray(data) ? data : [] });
        });

        // trigger: initial data fetch "session:get"
        socket.emit(EVENTS.SESSION_GET);
    }
}));