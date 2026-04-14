import { useEffect } from "react";
import "./NextRace.css";
import { useRaceState } from "../../hooks/useRaceState";
import { socket } from "../../socket/socket";
import EVENTS from "../../shared/events";

const NextRace = () => {
    // kõik andmed tulevad hookist
    const { sessions, raceMode, listenSocket } = useRaceState();

    useEffect(() => {
        // käivita socket kuulajad
        listenSocket();
        // küsi sessioonid kohe kui leht avaneb
        socket.emit(EVENTS.SESSION_GET);
    }, []);

    // leia järgmine sessioon — esimene mis pole veel alanud
    const nextSession = sessions.find(s => s.status === 'notStarted');

    // kas sessioon on lõppenud — näita paddock sõnumit
    const showPaddockMessage = raceMode === 'ended';

    return (
        <div className="next-race-container">
            <h1>NEXT RACE</h1>

            {/* Paddock sõnum kui sessioon lõppes */}
            {showPaddockMessage && (
                <div className="paddock-message">
                    Drivers — please proceed to the paddock
                </div>
            )}

            {/* Järgmine sessioon */}
            {nextSession ? (
                <div className="race-card">
                    <h2 className="race-title">
                        {nextSession.name || "Upcoming session"}
                    </h2>

                    <div className="driver-list">
                        {nextSession.drivers && nextSession.drivers.map((d, index) => (
                            <div key={d.id || index} className="driver-row">
                                <span className="driver-name">{d.name}</span>
                                <span className="driver-car">
                                    Car {d.car}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // kui järgmist sessiooni pole
                <p className="no-sessions">No upcoming sessions</p>
            )}
        </div>
    );
};

export default NextRace;