import { useEffect, useState } from "react"
import { socket } from "../../socket/socket"
import EVENTS from "../../shared/events"
import "./FrontDesk.css"

import SessionCard from "../../components/sessions/SessionCard"

export default function FrontDesk() {
    const [sessions, setSessions] = useState([])
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

    // CREATE SESSION
    const createSession = () => {
        if (!name.trim() || !startTime) return

        socket.emit(EVENTS.SESSION_CREATE, {
            name,
            startTime
        })

        setName("")
        setStartTime("")
    }

    // DELETE SESSION
    const deleteSession = (id) => {
        socket.emit(EVENTS.SESSION_DELETE, { id })
    }

    // ADD DRIVER
    const addDriver = (sessionId, name, car) => {
        if (!name?.trim()) return

        socket.emit(EVENTS.DRIVER_ADD, {
            sessionId,
            name,
            car
        })
    }

    // UPDATE DRIVER
    const updateDriver = (sessionId, driverId, updated) => {
        socket.emit(EVENTS.DRIVER_UPDATE, {
            sessionId,
            driverId,
            ...updated
        })
    }

    // REMOVE DRIVER
    const removeDriver = (sessionId, driverId) => {
        socket.emit(EVENTS.DRIVER_REMOVE, {
            sessionId,
            driverId
        })
    }

    return (
        <div className="container">
            <h1>Front Desk</h1>

            {/* CREATE SESSION */}
            <form
                className="create"
                onSubmit={(e) => {
                    e.preventDefault()
                    createSession()
                }}
            >
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

                <button type="submit">
                    Create
                </button>
            </form>

            {/* SESSIONS LIST */}
            <div className="sessions">
                {sessions.map(s => (
                    <SessionCard
                        key={s.id}
                        session={s}
                        onDelete={deleteSession}
                        onAddDriver={addDriver}
                        onRemoveDriver={removeDriver}
                        onUpdateDriver={updateDriver}
                    />
                ))}
            </div>
        </div>
    )
}