import { useState, useRef, useEffect } from "react"
import { socket } from "../socket/socket"
import EVENTS from "../shared/events"
import { testSessions } from "./devData"

export default function DevPanel() {

    // ------------------------
    // STATE (persisted)
    // ------------------------

    const [isOpen, setIsOpen] = useState(() => {
        return localStorage.getItem("devpanel-open") !== "false"
    })

    const [position, setPosition] = useState(() => {
        const saved = localStorage.getItem("devpanel-pos")

        if (saved) return JSON.parse(saved)

        // right-bottom corner by default
        const panelWidth = 200
        const panelHeight = 300 // approximate height

        return {
            x: window.innerWidth - panelWidth - 20,
            y: window.innerHeight - panelHeight - 20
        }
    })

    const dragging = useRef(false)
    const offset = useRef({ x: 0, y: 0 })

    // ------------------------
    // PERSIST
    // ------------------------

    useEffect(() => {
        localStorage.setItem("devpanel-open", isOpen)
    }, [isOpen])

    useEffect(() => {
        localStorage.setItem("devpanel-pos", JSON.stringify(position))
    }, [position])

    localStorage.removeItem("devpanel-pos")

    useEffect(() => {
        const handleResize = () => {
            setPosition(prev => ({
                x: Math.min(prev.x, window.innerWidth - 220),
                y: Math.min(prev.y, window.innerHeight - 100)
            }))
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // ------------------------
    // DRAG LOGIC
    // ------------------------

    const onMouseDown = (e) => {
        dragging.current = true
        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        }
    }

    const onMouseMove = (e) => {
        if (!dragging.current) return

        setPosition({
            x: e.clientX - offset.current.x,
            y: e.clientY - offset.current.y
        })
    }

    const onMouseUp = () => {
        dragging.current = false
    }

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("mouseup", onMouseUp)

        return () => {
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener("mouseup", onMouseUp)
        }
    }, [])

    // ------------------------
    // SOCKET ACTIONS
    // ------------------------

    const generateViaSocket = () => {
        testSessions.forEach(session => {
            socket.emit(EVENTS.SESSION_CREATE, {
                name: session.name
            })
        })

        const handler = (serverSessions) => {
            const fresh = serverSessions.filter(s => s.status === "notStarted")

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

    const clearAll = () => {
        const handler = (sessions) => {
            sessions.forEach(s => {
                socket.emit(EVENTS.SESSION_DELETE, { id: s.id })
            })

            socket.off(EVENTS.SESSION_LISTED, handler)
        }

        socket.on(EVENTS.SESSION_LISTED, handler)
        socket.emit(EVENTS.SESSION_GET)
    }

    const startRace = () => socket.emit(EVENTS.SESSION_START)
    const setSafe = () => socket.emit(EVENTS.SESSION_MODE, "safe")
    const setHazard = () => socket.emit(EVENTS.SESSION_MODE, "hazard")
    const setDanger = () => socket.emit(EVENTS.SESSION_MODE, "danger")
    const finishRace = () => socket.emit(EVENTS.SESSION_FINISH)
    const endSession = () => socket.emit(EVENTS.SESSION_END)

    // ------------------------
    // UI
    // ------------------------

    return (
        <div
            style={{
                ...panelStyle,
                left: position.x,
                top: position.y
            }}
        >

            {/* HEADER (DRAG HANDLE) */}
            <div
                style={headerStyle}
                onMouseDown={onMouseDown}
            >
                <span>DEV PANEL</span>

                <button
                    style={toggleBtn}
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsOpen(prev => !prev)
                    }}
                >
                    {isOpen ? "−" : "+"}
                </button>
            </div>

            {/* COLLAPSED */}
            {!isOpen && (
                <div style={{ padding: 6, fontSize: 11 }}>
                    ▶
                </div>
            )}

            {/* CONTENT */}
            {isOpen && (
                <div style={contentStyle}>

                    <div style={sectionTitle}>DATA</div>
                    <button onClick={generateViaSocket}>Generate</button>
                    <button onClick={clearAll}>Clear</button>

                    <div style={sectionTitle}>RACE</div>
                    <button onClick={startRace}>Start</button>
                    <button onClick={setSafe}>Safe</button>
                    <button onClick={setHazard}>Hazard</button>
                    <button onClick={setDanger}>Danger</button>
                    <button onClick={finishRace}>Finish</button>
                    <button onClick={endSession}>End</button>

                </div>
            )}
        </div>
    )
}

// ------------------------
// STYLES
// ------------------------

const panelStyle = {
    position: "fixed",
    width: 200,
    background: "#111",
    color: "#fff",
    borderRadius: 10,
    zIndex: 9999,
    fontSize: 12,
    userSelect: "none"
}

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: 8,
    cursor: "move",
    background: "#222",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
}

const contentStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 10
}

const sectionTitle = {
    fontSize: 10,
    opacity: 0.6,
    marginTop: 6
}

const toggleBtn = {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer"
}