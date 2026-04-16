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
            console.log("CREATE DATA:", data)

            const sessions = sessionService.getUpcomingSessions()
            console.log("SESSIONS AFTER CREATE:", sessions)

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

    //ADD driver to session
    socket.on(EVENTS.DRIVER_ADD, ({ sessionId, name, car }) => {
        try {
            sessionService.addDriver(sessionId, name, car)

            const sessions = sessionService.getUpcomingSessions()
            io.emit(EVENTS.SESSION_LISTED, sessions)

        } catch (err) {
            socket.emit(EVENTS.SESSION_ERROR, err.message)
        }
    })

    //REMOVE driver from session
    socket.on(EVENTS.DRIVER_REMOVE, ({ sessionId, driverId }) => {
        try {
            sessionService.removeDriver(sessionId, driverId)

            const sessions = sessionService.getUpcomingSessions()
            io.emit(EVENTS.SESSION_LISTED, sessions)

        } catch (err) {
            socket.emit(EVENTS.SESSION_ERROR, err.message)
        }
    })

    //UPDATE driver
    socket.on(EVENTS.DRIVER_UPDATE, ({ sessionId, driverId, name, car, lastLapTimestamp, lapCount, latestLapTime, currentLap, fastestLap, isFinished }) => {
        try {
            sessionService.updateDriver(sessionId, driverId, name, car, lastLapTimestamp, lapCount, latestLapTime, currentLap, fastestLap, isFinished)

            const sessions = sessionService.getUpcomingSessions()
            io.emit(EVENTS.SESSION_LISTED, sessions)

        } catch (err) {
            socket.emit(EVENTS.SESSION_ERROR, err.message)
        }
    })

}