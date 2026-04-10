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

            {/* HEADER */}
            <div className="card-header">
                <span>{session.name}</span>
                <span>{session.startTime}</span>
            </div>

            {/* TABLE */}
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
                        <span className="col name">{d.name}</span>
                        <span className="col car">{d.car}</span>

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
                <div className="add-driver">
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
                        className="col action add-btn"
                        onClick={() => onAddDriver(session.id)}
                    >
                        Add
                    </button>
                </div>
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