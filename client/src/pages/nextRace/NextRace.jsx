import { useEffect, useState } from "react";
import "./NextRace.css";
import { socket } from "../../socket/socket";
import EVENTS from "../../shared/events";

const mockNextRace = {
  name: "Italian Grand Prix race 2",
  drivers: [
    { id: 1, name: "Alice", car: "N°6" },
    { id: 2, name: "Dave", car: "N°8" }
  ]
};

const NextRace = () => {
  const [nextRace, setNextRace] = useState(null);

  useEffect(() => {
    // 1. Küsime kohe avamisel serverilt sessioone
    socket.emit(EVENTS.SESSION_GET);

    // 2. Kuulame serveri vastust
    socket.on(EVENTS.SESSION_LISTED, (sessions) => {
      console.log("Saadud sessioonid:", sessions);

      if (Array.isArray(sessions) && sessions.length > 0) {
        // Võtame esimese sessiooni, mis pole veel "finished"
        const upcoming = sessions.find(s => s.status !== "finished") || sessions[0];
        setNextRace(upcoming);
      }
    });

    // 3. Kuulame ka uue sessiooni loomist reaalajas
    socket.on(EVENTS.SESSION_CREATED, (newSession) => {
      setNextRace(newSession);
    });

    return () => {
      socket.off(EVENTS.SESSION_LISTED);
      socket.off(EVENTS.SESSION_CREATED);
    };
  }, []);

  const race = nextRace || mockNextRace;

  return (
    <div className="next-race-container">
      <h1>NEXT RACE</h1>

      {!nextRace && (
        <div className="debug-notice">
          <p>⚠️ Ühendus serveriga puudub - kuvatakse demoandmed</p>
        </div>
      )}

      <div className="race-card">
        <h2 className="race-title">{race.name || "Nimetu sessioon"}</h2>

        <div className="driver-list">
          {race.drivers && race.drivers.map((d, index) => (
            <div key={d.id || index} className="driver-row">
              <span className="driver-name">{d.name}</span>
              <span className="driver-car">{d.car}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NextRace;