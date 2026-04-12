function ListOfSessions({ sessions }) {
    return (
        <div className="listofsessions">
            <ul>
                {Array.isArray(sessions) && sessions.length > 0 ? (
                    sessions.map((session) => (
                        <li key={session.id}>
                            <strong>{session.name}</strong>

                            <ul>
                                {Array.isArray(session.drivers) && session.drivers.length > 0 ? (
                                    session.drivers.map((driver) => (
                                        <li key={driver.id}>
                                            {driver.name} — {driver.car}
                                        </li>
                                    ))
                                ) : (
                                    <li>No drivers</li>
                                )}
                            </ul>
                        </li>
                    ))
                ) : (
                    <li>No sessions</li>
                )}
            </ul>
        </div>
    );
}

export default ListOfSessions;