function SessionsListing({ session }) {
    if (!session) return null;

    return (
        <div className="race-card">
            <h2 className="race-title">
                {session.name || "Upcoming session"}
            </h2>

            <div className="driver-list">
                {session.drivers?.map((driver, index) => (
                    <div key={driver.id || index} className="driver-row">
                        <span className="driver-name">{driver.name}</span>
                        <span className="driver-car">
                            Car: {driver.car}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SessionsListing;