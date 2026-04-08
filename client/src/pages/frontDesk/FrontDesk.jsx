import { useEffect, useState } from "react"
import { socket } from "../../socket/socket"
import EVENTS from "../../shared/events"
import "./FrontDesk.css"

// This page is for managing sessions (creating/deleting) and viewing upcoming sessions.
export default function FrontDesk() {

    // 🔥 inputs per session
    const [inputs, setInputs] = useState({})

    const [sessions, setSessions] = useState([])
    const [name, setName] = useState("")

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // GET sessions on mount and listen for session list updates
    useEffect(() => {

        socket.emit(EVENTS.SESSION_GET)

        const handler = (data) => {
            console.log("✅ GOT DATA:", data)
            setSessions(data)
            setLoading(false)
        }

        socket.on(EVENTS.SESSION_LISTED, handler)

        return () => {
            socket.off(EVENTS.SESSION_LISTED, handler)
        }
    }, [])

    // SESSION ACTIONS
    const createSession = () => {
        if (!name.trim()) return

        socket.emit(EVENTS.SESSION_CREATE, { name })
        setName("")
    }

    const deleteSession = (id) => {
        socket.emit(EVENTS.SESSION_DELETE, { id })
    }

    // DRIVER INPUT HANDLERS
    const updateInput = (sessionId, field, value) => {
        setInputs(prev => {
            const sessionInput = prev[sessionId] || {}

            return {
                ...prev,
                [sessionId]: {
                    ...sessionInput,
                    [field]: value
                }
            }
        })
    }

    // DRIVER ACTIONS
    const addDriver = (sessionId) => {
        const data = inputs[sessionId] || {}

        if (!data.name?.trim()) return
        // can add more validation here if needed (like checking if car is provided)
        socket.emit(EVENTS.DRIVER_ADD, {
            sessionId,
            name: data.name,
            car: data.car
        })

        // clear inputs for this session
        setInputs(prev => {
            const copy = { ...prev }
            delete copy[sessionId]
            return copy
        })
    }
    // remove driver action
    const removeDriver = (sessionId, driverId) => {
        socket.emit(EVENTS.DRIVER_REMOVE, { sessionId, driverId })
    }

    //UI
    return (
        <div className="container">
            <h1>Front Desk</h1>

            {loading && <p>Loading sessions...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {/* CREATE SESSION */}
            <div className="create">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Session name"
                />
                <button
                    onClick={createSession}
                    disabled={!name.trim()}
                >
                    Create
                </button>
            </div>

            {/* SESSIONS */}
            <div className="sessions">
                {sessions.map(s => (
                    <div key={s.id} className="card">

                        <div className="card-content">
                            <strong>{s.name}</strong>

                            {/* DRIVERS */}
                            <div className="drivers">
                                {s.drivers?.map(d => (
                                    <div key={d.id} className="driver-row">
                                        {d.name} ({d.car})
                                        <button
                                            onClick={() => removeDriver(s.id, d.id)}
                                            className="delete-driver"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* ADD DRIVER */}
                            <div className="add-driver">
                                <input
                                    value={inputs[s.id]?.name ?? ""}
                                    onChange={(e) => updateInput(s.id, "name", e.target.value)}
                                    placeholder="Driver name"
                                />
                                <input
                                    value={inputs[s.id]?.car ?? ""}
                                    onChange={(e) => updateInput(s.id, "car", e.target.value)}
                                    placeholder="Car"
                                />
                                <button onClick={() => addDriver(s.id)}>
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* DELETE SESSION */}
                        <button
                            onClick={() => deleteSession(s.id)}
                            className="delete-session"
                        >
                            Delete
                        </button>

                    </div>
                ))}
            </div>
        </div>
    )
}