import { useState } from "react"
import "./SessionCard.css"

export default function SessionCard({
    session,
    onDelete,
    onAddDriver,
    onRemoveDriver,
    onUpdateDriver
}) {

    const [driverName, setDriverName] = useState("")
    const [car, setCar] = useState("")

    const [editedDrivers, setEditedDrivers] = useState({})

    const updateDriverField = (driverId, field, value) => {
        setEditedDrivers(prev => ({
            ...prev,
            [driverId]: {
                ...prev[driverId],
                [field]: value
            }
        }))
    }

    const saveDriver = (driverId) => {
        const updated = editedDrivers?.[driverId]
        if (!updated) return

        const original = session.drivers.find(d => d.id === driverId)
        if (!original) return

        if (
            updated.name === original.name &&
            updated.car === original.car
        ) return

        onUpdateDriver(session.id, driverId, updated)

        setEditedDrivers(prev => {
            const copy = { ...prev }
            delete copy[driverId]
            return copy
        })
    }

    return (
        <div className="session-card">

            {/* HEADER */}
            <div className="session-header">

                <div className="session-main">
                    <div className="session-name">{session.name}</div>

                    <div className="session-field">
                        <span className="label">Start Planned At:</span>
                        <span className="value">{session.startTime}</span>
                    </div>
                </div>

                <div className="session-side">

                    <div className="session-field">
                        <span className="label">Free Slots:</span>
                        <span className="value">
                            {session.freeSlotsLeft} / {session.maxSlots}
                        </span>
                    </div>

                    <div className="session-field">
                        <span className="label">Status:</span>
                        <span className={`session-status ${session.status}`}>
                            {session.status}
                        </span>
                    </div>

                </div>

            </div>

            {/* DRIVERS */}
            <div className="driver-list">

                <div className="drivers-header">
                    <div className="col">NAME</div>
                    <div className="col">CAR</div>
                    <div className="col"></div>
                </div>

                {session.drivers?.map(d => (
                    <div key={d.id} className="driver-row">

                        <input
                            className="col"
                            value={editedDrivers?.[d.id]?.name ?? d.name}
                            onChange={(e) =>
                                updateDriverField(d.id, "name", e.target.value)
                            }
                            onBlur={() => saveDriver(d.id)}
                        />

                        <input
                            className="col"
                            value={editedDrivers?.[d.id]?.car ?? d.car}
                            onChange={(e) =>
                                updateDriverField(d.id, "car", e.target.value)
                            }
                            onBlur={() => saveDriver(d.id)}
                        />

                        <button
                            className="col delete-driver"
                            onClick={() => onRemoveDriver(session.id, d.id)}
                        >
                            ❌
                        </button>

                    </div>
                ))}

            </div>

            {/* ADD DRIVER */}
            {onAddDriver && (
                <form
                    className="add-driver"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (!driverName.trim()) return

                        onAddDriver(session.id, driverName, car)

                        setDriverName("")
                        setCar("")
                    }}
                >
                    <input
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        placeholder="Driver name"
                    />

                    <input
                        value={car}
                        onChange={(e) => setCar(e.target.value)}
                        placeholder="Car"
                    />

                    <button type="submit" className="add-btn">
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