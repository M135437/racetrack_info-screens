import raceHandler from "./handlers/race.js";
import sessionHandler from "./handlers/session.js";  // REVIEW - match with Olga-s content
import lapHandler from "./handlers/lap.js";          //REVIEW - match with Mari-s content


export default function (io) {
    io.on("connection", (socket) => {
        console.log(`connected: ${socket.id}`);

       raceHandler(io, socket);
       sessionHandler(io, socket);
       lapHandler(io, socket);

        socket.emit("hello", "backend works"); // testimise jaoks - kui ühendus luuakse, saadab server sõnumi "hello" koos tekstiga "backend works"
    });
};