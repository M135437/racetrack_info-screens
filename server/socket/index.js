import raceHandler from "./handlers/race.js";
import sessionHandler from "./handlers/session.js";  // REVIEW - match with Olga-s content
import lapHandler from "./handlers/lap.js";          //REVIEW - match with Mari-s content

export default function(io) {
    io.on("connection", (socket) => {
        console.log(`connected: ${socket.id} from ${socket.address} with auth ${socket.auth}, time ${socket.time}`);

       raceHandler(socket, io);
       sessionHandler(socket, io);
       lapHandler(socket, io);
    });
};