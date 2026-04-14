import { useState } from "react"
import { socket } from "../../socket/socket"
import EVENTS from "../../shared/events"

export default function SessionCard({
    session,
    onDelete,
    onAddDriver,
    onRemoveDriver,
    input = {},
    updateInput
}) {

    //local state to manage edited driver info before sending update to server
    const [editedDrivers, setEditedDrivers] = useState({})

    //field change handler for driver info update (name, car) 
    const updateDriverField = (driverId, field, value) => {
        setEditedDrivers(prev => ({
            ...prev,
            [driverId]: {
                ...prev[driverId],
                [field]: value
            }
        }))
    }

    // saving driver updates (name, car) by emitting update event to server
    const saveDriver = (driverId) => {
        const updated = editedDrivers?.[driverId]
        if (!updated) return

        const original = session.drivers.find(d => d.id === driverId)
        if (!original) return

        // if no changes were made, do not emit update event to server
        if (
            updated.name === original.name &&
            updated.car === original.car
        ) return

        socket.emit(EVENTS.DRIVER_UPDATE, {
            sessionId: session.id,
            driverId,
            ...updated
        })

        // clean up editedDrivers state for the driver after saving changes
        setEditedDrivers(prev => {
            const copy = { ...prev }
            delete copy[driverId]
            return copy
        })
    }

    return (
        <div className="card">

            {/* HEADER */}
            <div className="card-header">
                <span>{session.name}</span>
                <span>{session.startTime}</span>
            </div>

            {/* DRIVERS */}
            <div className="drivers">

                {/* columns */}
                <div className="drivers-header">
                    <span className="col name">Name</span>
                    <span className="col car">Car</span>
                    <span className="col action"></span>
                </div>

                {/* rows */}
                {session.drivers?.map(d => (
                    <div key={d.id} className="driver-row">

                        <input
                            className="col name"
                            value={editedDrivers?.[d.id]?.name ?? d.name}
                            onChange={(e) =>
                                updateDriverField(d.id, "name", e.target.value)
                            }
                            onBlur={() => saveDriver(d.id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    saveDriver(d.id)
                                    e.target.blur()
                                }
                            }}
                        />

                        <input
                            className="col car"
                            value={editedDrivers?.[d.id]?.car ?? d.car}
                            onChange={(e) =>
                                updateDriverField(d.id, "car", e.target.value)
                            }
                            onBlur={() => saveDriver(d.id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    saveDriver(d.id)
                                    e.target.blur()
                                }
                            }}
                        />

                        {onRemoveDriver && (
                            <button
                                className="col action delete-driver"
                                onClick={() => onRemoveDriver(session.id, d.id)}
                            >
                                ❌
                            </button>
                        )}
                    </div>
                ))}

            </div>

            {/* ADD DRIVER */}
            {onAddDriver && (
                <form
                    className="add-driver"
                    onSubmit={(e) => {
                        e.preventDefault()
                        onAddDriver(session.id)
                    }}
                >
                    <input
                        className="col name"
                        value={input.name ?? ""}
                        onChange={(e) =>
                            updateInput(session.id, "name", e.target.value)
                        }
                        placeholder="Driver name"
                    />

                    <input
                        className="col car"
                        value={input.car ?? ""}
                        onChange={(e) =>
                            updateInput(session.id, "car", e.target.value)
                        }
                        placeholder="Car"
                    />

                    <button
                        type="submit"
                        className="col action add-btn"
                        disabled={!input.name?.trim()}
                    >
                        Add
                    </button>
                </form>
            )}

            {/* DELETE SESSION */}
            {onDelete && (
                <button
                    onClick={() => onDelete(session.id)}
                    className="delete-session"
                >
                    Delete
                </button>
            )}

        </div>
    )
}