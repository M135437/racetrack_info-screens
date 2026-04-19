import { useEffect, useState } from "react"
import { socket } from "../../socket/socket"
import EVENTS from "../../shared/events"
import "./FrontDesk.css"
import { useRaceState } from "../../hooks/useRaceState"

import SessionCard from "../../components/sessions/SessionCard"

export default function FrontDesk() {
    const sessions = useRaceState(state => state.sessions)
    const [inputs, setInputs] = useState({})
    const [name, setName] = useState("")



    const createSession = () => {
        if (!name.trim()) return

        socket.emit(EVENTS.SESSION_CREATE, {
            name
        })

        setName("")
    }

    const deleteSession = (id) => {
        socket.emit(EVENTS.SESSION_DELETE, { id })
    }


    const updateInput = (sessionId, field, value) => {
        setInputs(prev => ({
            ...prev,
            [sessionId]: {
                ...(prev[sessionId] || {}),
                [field]: value
            }
        }))
    }


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


                <button type="submit">
                    Create
                </button>
            </form>

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