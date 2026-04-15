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

    // ADD CAR
    const addCar = (sessionId, name, car) => {
        if (!name?.trim()) return

        socket.emit(EVENTS.CAR_ADD, {
            sessionId,
            name,
            car
        })
    }

    // UPDATE CAR
    const updateCar = (sessionId, carId, updated) => {
        socket.emit(EVENTS.CAR_UPDATE, {
            sessionId,
            carId,
            ...updated
        })
    }

    // REMOVE CAR
    const removeCar = (sessionId, carId) => {
        socket.emit(EVENTS.CAR_REMOVE, {
            sessionId,
            carId
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
                        onAddCar={addCar}
                        onRemoveCar={removeCar}
                        onUpdateCar={updateCar}
                    />
                ))}
            </div>
        </div>
    )
}