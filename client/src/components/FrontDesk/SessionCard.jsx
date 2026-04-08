import { useState } from "react"

export default function SessionCard({
    session,
    onDelete,
    onAddDriver,
    onReady
}) {
    // 🔥 защита от undefined
    const drivers = session?.drivers || []
    const status = session?.status || "draft"
    const name = session?.name || "No name"

    const [driverName, setDriverName] = useState("")
    const [carNumber, setCarNumber] = useState("")

    const isLocked = status !== "draft"

    const handleAddDriver = () => {
        if (!driverName || !carNumber) return

        onAddDriver(session.id, {
            name: driverName,
            carNumber: Number(carNumber)
        })

        setDriverName("")
        setCarNumber("")
    }

    return (
        <div style={{
            border: "1px solid #ccc",
            padding: 16,
            borderRadius: 8,
            marginBottom: 12
        }}>
            {/* HEADER */}
            <div style={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <h3>{name}</h3>
                <span>{status}</span>
            </div>

            {/* DRIVERS */}
            <ul>
                {drivers.length === 0 ? (
                    <li style={{ opacity: 0.6 }}>No drivers</li>
                ) : (
                    drivers.map((d) => (
                        <li key={d.id}>
                            {d.name} (#{d.carNumber})
                        </li>
                    ))
                )}
            </ul>

            {/* ADD DRIVER */}
            {!isLocked && (
                <div style={{ marginTop: 10 }}>
                    <input
                        placeholder="Driver name"
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                    />
                    <input
                        placeholder="Car #"
                        value={carNumber}
                        onChange={(e) => setCarNumber(e.target.value)}
                    />
                    <button onClick={handleAddDriver}>
                        Add Driver
                    </button>
                </div>
            )}

            {/* ACTIONS */}
            <div style={{ marginTop: 10 }}>
                {status === "draft" && (
                    <button onClick={() => onReady(session.id)}>
                        Ready
                    </button>
                )}

                <button onClick={() => onDelete(session.id)}>
                    Delete
                </button>
            </div>
        </div>
    )
}