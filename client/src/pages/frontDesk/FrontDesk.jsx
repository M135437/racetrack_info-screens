import { useEffect, useState } from "react"
import { socket } from "../../socket/socket"
import EVENTS from "../../shared/events"
import "./FrontDesk.css"

import SessionCard from "../../components/sessions/SessionCard"

export default function FrontDesk() {
    const [sessions, setSessions] = useState([])
    const [inputs, setInputs] = useState({})
    const [name, setName] = useState("")
    const [startTime, setStartTime] = useState("")

    useEffect(() => {
        socket.emit(EVENTS.SESSION_GET)

        const handler = (data) => {
            setSessions(data)
        }

        socket.on(EVENTS.SESSION_LISTED, handler)

        return () => {
            socket.off(EVENTS.SESSION_LISTED, handler)
        }
    }, [])

    // SESSION
    const createSession = () => {
        if (!name.trim() || !startTime) return

        socket.emit(EVENTS.SESSION_CREATE, {
            name,
            startTime
        })

        setName("")
        setStartTime("")
    }

    const deleteSession = (id) => {
        socket.emit(EVENTS.SESSION_DELETE, { id })
    }

    // INPUT
    const updateInput = (sessionId, field, value) => {
        setInputs(prev => ({
            ...prev,
            [sessionId]: {
                ...(prev[sessionId] || {}),
                [field]: value
            }
        }))
    }

    // DRIVER
    const addDriver = (sessionId) => {
        const data = inputs[sessionId] || {}
        if (!data.name?.trim()) return

        socket.emit(EVENTS.DRIVER_ADD, {
            sessionId,
            name: data.name,
            car: data.car
        })

        setInputs(prev => {
            const copy = { ...prev }
            delete copy[sessionId]
            return copy
        })
    }

    const removeDriver = (sessionId, driverId) => {
        socket.emit(EVENTS.DRIVER_REMOVE, { sessionId, driverId })
    }

    return (
        <div className="container">
            <h1>Front Desk</h1>

            {/* CREATE */}
            <div className="create">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Race name"
                />

                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
                <button onClick={createSession}>
                    Create
                </button>
            </div>

            {/* LIST */}
            <div className="sessions">
                {sessions.map(s => (
                    <SessionCard
                        key={s.id}
                        session={s}
                        onDelete={deleteSession}
                        onAddDriver={addDriver}
                        onRemoveDriver={removeDriver}
                        input={inputs[s.id] || {}}
                        updateInput={updateInput}
                    />
                ))}
            </div>
        </div>
    )
}