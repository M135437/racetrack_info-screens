export default function SessionCard({
    session,
    onDelete,
    onAddDriver,
    onRemoveDriver,
    input = {},
    updateInput
}) {
    return (
        <div className="card">

            <div className="card-content">
                <strong>{session.name}</strong>

                {/* DRIVERS */}
                <div className="drivers">
                    {session.drivers?.map(d => (
                        <div key={d.id} className="driver-row">
                            {d.name} ({d.car})

                            {onRemoveDriver && (
                                <button
                                    onClick={() => onRemoveDriver(session.id, d.id)}
                                    className="delete-driver"
                                >
                                    ❌
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* ADD DRIVER */}
                {onAddDriver && (
                    <div className="add-driver">
                        <input
                            value={input.name ?? ""}
                            onChange={(e) =>
                                updateInput(session.id, "name", e.target.value)
                            }
                            placeholder="Driver name"
                        />
                        <input
                            value={input.car ?? ""}
                            onChange={(e) =>
                                updateInput(session.id, "car", e.target.value)
                            }
                            placeholder="Car"
                        />
                        <button onClick={() => onAddDriver(session.id)}>
                            Add
                        </button>
                    </div>
                )}
            </div>

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