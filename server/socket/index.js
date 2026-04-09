import raceHandler from "./handlers/race.js";
import sessionHandler from "./handlers/session.js";  // REVIEW - match with Olga-s content
import lapHandler from "./handlers/lap.js";          //REVIEW - match with Mari-s content


export default function (io) {
    io.on("connection", (socket) => {
        console.log(`connected: ${socket.id}`);

        raceHandler(io, socket); //REVIEW - match with Mari-s content      
        sessionHandler(io, socket); //REVIEW - match with Olga-s content   
        lapHandler(io, socket); //REVIEW - match with Mari-s content      

        socket.emit("hello", "backend works"); // testimise jaoks - kui ühendus luuakse, saadab server sõnumi "hello" koos tekstiga "backend works"
    });
};