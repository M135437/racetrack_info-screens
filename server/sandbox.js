// -> testimaks ERALDI PORT-IS dev3 faile <-

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";


// saab olla "lapHandler" nimetusega (siin ise pandud), sest lap.js
// sees on exporditud "default"
// KUI OLEKS SEAL NIMEGA, peaks kajastuma impordis
// ja olema { lapHandler } õiges vormingus
import lapHandler from "./socket/handlers/lap.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "http://localhost:5173" }
});

io.on("connection", (socket) => {
    console.log("sandbox server: dev3 ühendatud!", socket.id);

    lapHandler(io, socket);
});

httpServer.listen(5000, () => {
    console.log("sandbox-server, port: 5000");
    console.log("dev3 töö testimiseks")
});