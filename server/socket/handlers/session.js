import * as sessionService from '../../services/sessionService.js'
import EVENTS from "../../../client/src/shared/events.js";


export default function sessionHandler(io, socket) {

    //GET upcoming sessions
    socket.on(EVENTS.SESSION_GET, () => {
        const sessions = sessionService.getUpcomingSessions()
        socket.emit(EVENTS.SESSION_LISTED, sessions)
    })

    //CREATE session
    socket.on(EVENTS.SESSION_CREATE, (data) => {
        try {
            sessionService.createSession(data.name)

            const sessions = sessionService.getUpcomingSessions()

            io.emit(EVENTS.SESSION_LISTED, sessions)

        } catch (err) {
            socket.emit(EVENTS.SESSION_ERROR, err.message)
        }
    })

    //DELETE session
    socket.on(EVENTS.SESSION_DELETE, ({ id }) => {
        try {
            sessionService.deleteSession(id)

            const sessions = sessionService.getUpcomingSessions()

            io.emit(EVENTS.SESSION_LISTED, sessions)

        } catch (err) {
            socket.emit(EVENTS.SESSION_ERROR, err.message)
        }
    })
}