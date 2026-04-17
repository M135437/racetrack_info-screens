import authProcess from "../services/authService.js"

export default function auth (io,socket) {
    authProcess(io,socket);
};