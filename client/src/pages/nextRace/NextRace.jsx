import { useEffect, useState } from "react";
import "./NextRace.css";
// import socket ja EVENTS kui olemas

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
    // 👉 kommenteeri sisse kui socket valmis
    /*
    socket.emit(EVENTS.SESSION_GET);

    socket.on(EVENTS.SESSION_LISTED, (sessions) => {
      console.log("sessions:", sessions);

      if (!sessions || sessions.length === 0) return;

      setNextRace(sessions[0]);
    });
    */
  }, []);

  // 👉 fallback kui backend ei anna midagi
  const race = nextRace || mockNextRace;

  return (
    <div className="next-race-container">
      <h1>NEXT RACE</h1>

      {!nextRace && (
        <p>⚠️ Hetkel pole päris andmeid – kuvatakse testandmed</p>
      )}

      <div className="race-card">
        <h2>{race.name}</h2>

        {race.drivers.map((d) => (
          <div key={d.id} className="driver-row">
            <span>{d.name}</span>
            <span>{d.car}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextRace;