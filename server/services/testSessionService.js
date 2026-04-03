import * as service from './sessionService.js'

try {
    // ➕ CREATE
    const s1 = service.createSession("Race 1")
    const s2 = service.createSession("Race 2")

    console.log("CREATED:", s1, s2)

    // 📥 GET
    const allSessions = service.getUpcomingSessions()
    console.log("ALL SESSIONS:", allSessions)

    // ❌ DELETE existing
    const deleteResult = service.deleteSession(1)
    console.log("DELETE RESULT:", deleteResult)

    const afterDelete = service.getUpcomingSessions()
    console.log("AFTER DELETE:", afterDelete)

    // ❌ DELETE non-existing (praeguse loogikaga EI anna errorit)
    const deleteNonExisting = service.deleteSession(999)
    console.log("DELETE NON-EXISTING:", deleteNonExisting)

    // ⚠️ CREATE error case
    try {
        service.createSession("")
    } catch (err) {
        console.log("EXPECTED ERROR:", err.message)
    }

} catch (err) {
    console.error("UNEXPECTED ERROR:", err.message)
}