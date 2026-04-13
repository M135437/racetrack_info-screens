import { useEffect, useState } from "react";
import "./NextRace.css";
import { socket } from "../../socket/socket";
import EVENTS from "../../shared/events";

const NextRace = () => {
    const [nextRace, setNextRace] = useState(null);
    const [sessionEnded, setSessionEnded] = useState(false);

    useEffect(() => {
        socket.emit(EVENTS.SESSION_GET);

        socket.on(EVENTS.SESSION_LISTED, (sessions) => {
            if (Array.isArray(sessions) && sessions.length > 0) {
                const upcoming = sessions.find(s => s.status !== "finished");
                setNextRace(upcoming || null);
            }
        });

        socket.on(EVENTS.SESSION_CREATED, (newSession) => {
            setNextRace(newSession);
            setSessionEnded(false);
        });

        // When race starts, move to the NEXT session in the list
        socket.on(EVENTS.SESSION_STARTED, (data) => {
            setSessionEnded(false);
            if (data.nextSession) {
                setNextRace(data.nextSession);
            } else {
                setNextRace(null);
            }
        });

        // When session ends, show the paddock message
        socket.on(EVENTS.SESSION_ENDED, () => {
            setSessionEnded(true);
        });

        return () => {
            socket.off(EVENTS.SESSION_LISTED);
            socket.off(EVENTS.SESSION_CREATED);
            socket.off(EVENTS.SESSION_STARTED);
            socket.off(EVENTS.SESSION_ENDED);
        };
    }, []);

    return (
        <div className="next-race-container">
            <h1>NEXT RACE</h1>

            {sessionEnded && (
                <div className="paddock-message">
                    Drivers — please proceed to the paddock
                </div>
            )}

            {nextRace ? (
                <div className="race-card">
                    <h2 className="race-title">{nextRace.name || "Upcoming session"}</h2>
                    <div className="driver-list">
                        {nextRace.drivers && nextRace.drivers.map((d, index) => (
                            <div key={d.id || index} className="driver-row">
                                <span className="driver-name">{d.name}</span>
                                <span className="driver-car">{d.car}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="no-sessions">No upcoming sessions</p>
            )}
        </div>
    );
};

export default NextRace;