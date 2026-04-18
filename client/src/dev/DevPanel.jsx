import { socket } from "../socket/socket"
import EVENTS from "../shared/events"
import { testSessions } from "./devData"

export default function DevPanel() {

    // ------------------------
    // GENERATE (sessions + drivers)
    // ------------------------

    const generateViaSocket = () => {
        console.log("Generating sessions + drivers...")

        // 1. создаём сессии
        testSessions.forEach(session => {
            socket.emit(EVENTS.SESSION_CREATE, {
                name: session.name
            })
        })

        // 2. ждём список от сервера
        const handler = (serverSessions) => {
            console.log("SESSION_LISTED:", serverSessions)

            const fresh = serverSessions.filter(
                s => s.status === "notStarted"
            )

            // 3. добавляем drivers
            fresh.forEach((serverSession, index) => {
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
    // CLEAR ALL
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
    // RACE CONTROL
    // ------------------------

    const startRace = () => {
        console.log("Start race")
        socket.emit(EVENTS.SESSION_START)
    }

    const setSafe = () => {
        socket.emit(EVENTS.SESSION_MODE, "safe")
    }

    const setHazard = () => {
        socket.emit(EVENTS.SESSION_MODE, "hazard")
    }

    const setDanger = () => {
        socket.emit(EVENTS.SESSION_MODE, "danger")
    }

    const finishRace = () => {
        console.log("Finish race")
        socket.emit(EVENTS.SESSION_FINISH)
    }

    const endSession = () => {
        console.log("End session")
        socket.emit(EVENTS.SESSION_END)
    }

    // ------------------------
    // UI
    // ------------------------

    return (
        <div style={panelStyle}>

            <div style={titleStyle}>DEV PANEL</div>

            {/* DATA */}
            <section style={sectionStyle}>
                <div style={sectionTitle}>DATA</div>

                <button onClick={generateViaSocket}>
                    Generate sessions
                </button>

                <button onClick={clearAll}>
                    Clear all
                </button>
            </section>

            {/* RACE CONTROL */}
            <section style={sectionStyle}>
                <div style={sectionTitle}>RACE CONTROL</div>

                <button onClick={startRace}>Start</button>
                <button onClick={setSafe}>Safe</button>
                <button onClick={setHazard}>Hazard</button>
                <button onClick={setDanger}>Danger</button>
                <button onClick={finishRace}>Finishing</button>
                <button onClick={endSession}>End</button>
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
    width: 240,
    background: "#111",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: 12,
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