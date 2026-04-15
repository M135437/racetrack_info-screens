import * as sessionService from '../../services/sessionService.js'
import EVENTS from "../../../client/src/shared/events.js";

export default function sessionHandler(io, socket) {

    // GET
    socket.on(EVENTS.SESSION_GET, () => {
        const sessions = sessionService.getUpcomingSessions()
        socket.emit(EVENTS.SESSION_LISTED, sessions)
    })

    // CREATE
    socket.on(EVENTS.SESSION_CREATE, (data) => {
        try {
            sessionService.createSession(data.name, data.startTime)

            const sessions = sessionService.getUpcomingSessions()
            io.emit(EVENTS.SESSION_LISTED, sessions)

        } catch (err) {
            socket.emit(EVENTS.SESSION_ERROR, err.message)
        }
    })

    // DELETE
    socket.on(EVENTS.SESSION_DELETE, ({ id }) => {
        try {
            sessionService.deleteSession(id)

            const sessions = sessionService.getUpcomingSessions()
            io.emit(EVENTS.SESSION_LISTED, sessions)

        } catch (err) {
            socket.emit(EVENTS.SESSION_ERROR, err.message)
        }
    })

    // ADD CAR
    socket.on(EVENTS.CAR_ADD, ({ sessionId, name, car }) => {
        try {
            sessionService.addCar(sessionId, name, car)

            const sessions = sessionService.getUpcomingSessions()
            io.emit(EVENTS.SESSION_LISTED, sessions)
        } catch (err) {
            socket.emit(EVENTS.SESSION_ERROR, err.message)
        }
    })

    // REMOVE CAR
    socket.on(EVENTS.CAR_REMOVE, ({ sessionId, carId }) => {
        try {
            sessionService.removeCar(sessionId, carId)

            const sessions = sessionService.getUpcomingSessions()
            io.emit(EVENTS.SESSION_LISTED, sessions)
        } catch (err) {
            socket.emit(EVENTS.SESSION_ERROR, err.message)
        }
    })

    // UPDATE CAR (ex-driver)
    socket.on(EVENTS.CAR_UPDATE, (data) => {
        try {
            const { sessionId, carId, ...updates } = data

            sessionService.updateCar(sessionId, carId, updates)

            io.emit(EVENTS.LAP_UPDATE, {
                sessionId,
                carId: carId, // можно оставить carId как payload-ключ или тоже переименовать ниже
                ...updates
            })
        } catch (err) {
            socket.emit(EVENTS.SESSION_ERROR, err.message)
        }
    })

}