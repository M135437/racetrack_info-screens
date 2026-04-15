import { useState } from "react"
import "./SessionCard.css"

export default function SessionCard({
    session,
    onDelete,
    onAddCar,
    onRemoveCar,
    onUpdateCar
}) {

    // локальный state для добавления машины
    const [name, setName] = useState("")
    const [car, setCar] = useState("")

    // локальный state для редактирования
    const [editedCars, setEditedCars] = useState({})

    const updateCarField = (carId, field, value) => {
        setEditedCars(prev => ({
            ...prev,
            [carId]: {
                ...prev[carId],
                [field]: value
            }
        }))
    }

    const saveCar = (carId) => {
        const updated = editedCars?.[carId]
        if (!updated) return

        const original = session.cars.find(c => c.id === carId)
        if (!original) return

        if (
            updated.name === original.name &&
            updated.car === original.car
        ) return

        onUpdateCar(session.id, carId, updated)

        setEditedCars(prev => {
            const copy = { ...prev }
            delete copy[carId]
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

            {/* CARS */}
            <div className="driver-list">

                <div className="drivers-header">
                    <div className="col">NAME</div>
                    <div className="col">CAR</div>
                    <div className="col"></div>
                </div>

                {session.cars?.map(c => (
                    <div key={c.id} className="driver-row">

                        <input
                            className="col"
                            value={editedCars?.[c.id]?.name ?? c.name}
                            onChange={(e) =>
                                updateCarField(c.id, "name", e.target.value)
                            }
                            onBlur={() => saveCar(c.id)}
                        />

                        <input
                            className="col"
                            value={editedCars?.[c.id]?.car ?? c.car}
                            onChange={(e) =>
                                updateCarField(c.id, "car", e.target.value)
                            }
                            onBlur={() => saveCar(c.id)}
                        />

                        <button
                            className="col delete-driver"
                            onClick={() => onRemoveCar(session.id, c.id)}
                        >
                            ❌
                        </button>

                    </div>
                ))}

            </div>

            {/* ADD CAR */}
            {onAddCar && (
                <form
                    className="add-driver"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (!name.trim()) return

                        onAddCar(session.id, name, car)

                        setName("")
                        setCar("")
                    }}
                >
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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