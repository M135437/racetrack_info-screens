// test client for socket.io server
// first do npm install socket.io-client
//run with node testClient.js

import { io } from "socket.io-client"

const socket = io("http://localhost:3000")

socket.on("connect", () => {
    console.log("Connected:", socket.id)

    // 📥 küsi list
    socket.emit("session:get")

    // ➕ create
    socket.emit("session:create", { name: "Race from test client" })

    // ❌ delete (proovi hiljem)
    setTimeout(() => {
        socket.emit("session:delete", 1)
    }, 2000)
})

// 📡 kuula vastuseid
socket.on("session:list", (data) => {
    console.log("SESSION LIST:", data)
})

socket.on("session:error", (err) => {
    console.log("ERROR:", err)
})