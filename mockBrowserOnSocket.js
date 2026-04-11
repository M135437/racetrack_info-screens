import { io } from "socket.io-client";
import EVENTS from "../client/src/shared/events.js";

const socket = io("http://localhost:3000", {
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("Connected to backend socket:", socket.id);

  // Küsi FrontDeski moodi sessioonide nimekiri
  socket.emit(EVENTS.SESSION_GET);
});

socket.on(EVENTS.SESSION_LISTED, (sessions) => {
  console.log("SESSION_LISTED received:", sessions);
  const notStarted = Array.isArray(sessions)
    ? sessions.filter((session) => session.status === "notStarted")
    : [];


  console.log("notStarted sessions:");
  notStarted.forEach((session) => {
    console.log(`- id=${session.id}, name=${session.name ?? "<no name>"}, status=${session.status}`);
  });
});

socket.on(EVENTS.SESSION_ERROR, (err) => {
  console.error("SESSION_ERROR:", err);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});
