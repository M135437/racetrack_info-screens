import raceHandler from "./handlers/race.js";
import sessionHandler from "./handlers/session.js";
import lapHandler from "./handlers/lap.js";
import auth from "./auth.js";


export default function (io) {
    io.on("connection", (socket) => {
        console.log(`Socket handler on server side connected: ${socket.id}`);

        auth(io,socket);
        raceHandler(io, socket);
        sessionHandler(io, socket);
        lapHandler(io, socket);
    });
};