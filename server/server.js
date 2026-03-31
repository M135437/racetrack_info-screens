
// Simple Express server with Socket.IO for real-time communication (minimal setup - module syntax)
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.get("/test", (req, res) => {
    res.json({ ok: true });
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});

io.on("connection", (socket) => {
    console.log("client connected:", socket.id);
});

/*io.on("connection", (socket) => {
    console.log("client connected:", socket.id);

    socket.emit("hello", "backend works");
});*/ //for testing


server.listen(3000, () => {
    console.log("Server running on port 3000");
});