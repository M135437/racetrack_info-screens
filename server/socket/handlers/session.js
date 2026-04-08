import * as sessionService from '../../services/sessionService.js'

export default function sessionHandler(socket, io) {

    //GET upcoming sessions
    socket.on("session:get", () => {
        const sessions = sessionService.getUpcomingSessions()
        socket.emit("session:listed", sessions)
    })

    //CREATE session
    socket.on("session:create", (data) => {
        try {
            sessionService.createSession(data.name)

            const sessions = sessionService.getUpcomingSessions()

            //emit updated session list to all clients (could be optimized to emit only to clients that need it, but for simplicity emitting to all)
            io.emit("session:list", sessions)

        } catch (err) {
            socket.emit("session:error", err.message)
        }
    })

    //DELETE session
    socket.on("session:delete", (id) => {
        try {
            sessionService.deleteSession(id)

            const sessions = sessionService.getUpcomingSessions()

            io.emit("session:list", sessions)

        } catch (err) {
            socket.emit("session:error", err.message)
        }
    })
}