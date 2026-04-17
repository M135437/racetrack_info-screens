import { useEffect } from "react";
import "./NextRace.css";
import { useRaceState } from "../../hooks/useRaceState";
import { socket } from "../../socket/socket";
import EVENTS from "../../shared/events";
import SessionListing from "../../components/SessionListing";

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
  const nextSession = sessions.find((s) => s.status === "notStarted");

  // kas sessioon on lõppenud — näita paddock sõnumit
  const showPaddockMessage = raceMode === "ended";

  return (
    <div className="next-race-container">
        {/* 🔥 FULLSCREEN NUPP */}
      <button
        className="fullscreen-btn"
        onClick={() => document.documentElement.requestFullscreen()}
      >
        Fullscreen
      </button>

      <h1>NEXT RACE</h1>

      {/* Paddock sõnum kui sessioon lõppes */}
      {showPaddockMessage && (
        <div className="paddock-message">
          Drivers — please proceed to the paddock
        </div>
      )}

      {/* Järgmine sessioon */}
      {nextSession ? (
        <SessionListing nextSession={nextSession} />
      ) : (
        // kui järgmist sessiooni pole
        <p className="no-sessions">No upcoming sessions</p>
      )}
    </div>
  );
};

export default NextRace;
