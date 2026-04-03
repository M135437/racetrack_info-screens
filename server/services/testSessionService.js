import * as service from './sessionService.js'

try {
    service.createSession("Race 1")
    service.createSession("Race 2")

    console.log("ALL:", service.getUpcomingSessions())

    service.deleteSession(1)

    console.log("AFTER DELETE:", service.getUpcomingSessions())

} catch (err) {
    console.error("ERROR:", err.message)
}