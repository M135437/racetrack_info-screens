import { io } from "socket.io-client";

const socket = io("ws://localhost:3000");

// receive a message from the server
socket.on("hello", (arg) => {
    console.log(arg); // prints "world"
});

// send a message to the server
let viiekumneni = 0;
while (viiekumneni < 50) {
    socket.emit("howdy", "stranger" + (viiekumneni+1));
    viiekumneni++;
    await sleep(500);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}