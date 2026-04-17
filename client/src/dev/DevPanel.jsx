import { socket } from "../socket/socket"
import EVENTS from "../shared/events"
import { testSessions } from "./devData"

export default function DevPanel() {

    // ------------------------
    // GENERATE (sessions + drivers)
    // ------------------------

    const generateViaSocket = () => {
        console.log("Generating sessions + drivers via socket...")

        // 1. создаём сессии
        testSessions.forEach(session => {
            socket.emit(EVENTS.SESSION_CREATE, {
                name: session.name
            })
        })

        // 2. ждём обновление
        const handler = (serverSessions) => {
            console.log("SESSION_LISTED:", serverSessions)

            const freshSessions = serverSessions.filter(
                s => s.status === "notStarted"
            )

            // 3. добавляем drivers
            freshSessions.forEach((serverSession, index) => {
                const testSession = testSessions[index]
                if (!testSession) return

                testSession.drivers.forEach(driver => {
                    socket.emit(EVENTS.DRIVER_ADD, {
                        sessionId: serverSession.id,
                        name: driver.name,
                        car: driver.car
                    })
                })
            })

            socket.off(EVENTS.SESSION_LISTED, handler)
        }

        socket.on(EVENTS.SESSION_LISTED, handler)
    }

    // ------------------------
    // CLEAR ALL (delete sessions)
    // ------------------------

    const clearAll = () => {
        console.log("Clearing all sessions...")

        const handler = (sessions) => {
            sessions.forEach(s => {
                socket.emit(EVENTS.SESSION_DELETE, { id: s.id })
            })

            socket.off(EVENTS.SESSION_LISTED, handler)
        }

        socket.on(EVENTS.SESSION_LISTED, handler)

        socket.emit(EVENTS.SESSION_GET)
    }

    // ------------------------
    // UI
    // ------------------------

    return (
        <div style={panelStyle}>

            <div style={titleStyle}>DEV PANEL</div>

            <section style={sectionStyle}>
                <div style={sectionTitle}>SERVER (socket)</div>

                <button onClick={generateViaSocket}>
                    Generate sessions
                </button>

                <button onClick={clearAll}>
                    Clear all
                </button>
            </section>

        </div>
    )
}

// ------------------------
// STYLES
// ------------------------

const panelStyle = {
    position: "fixed",
    top: 10,
    right: 10,
    width: 220,
    background: "#111",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    zIndex: 9999,
    fontSize: 12
}

const titleStyle = {
    fontWeight: "bold",
    fontSize: 14
}

const sectionStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 6
}

const sectionTitle = {
    fontSize: 11,
    opacity: 0.7
}