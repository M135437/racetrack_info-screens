import { useEffect, useState } from "react";
import "./NextRace.css";
import { useRaceState } from "../../hooks/useRaceState";
import { socket } from "../../socket/socket";
import EVENTS from "../../shared/events";
import SessionListing from "../../components/SessionListing";

const NextRace = () => {
  const { sessions, raceMode, listenSocket } = useRaceState();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    listenSocket();
    socket.emit(EVENTS.SESSION_GET);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const nextSession = sessions.find((s) => s.status === "notStarted");
  const showPaddockMessage = raceMode === "ended";

  return (
    <div className="next-race-container">

      {/* Fullscreen toggle */}
      <button className="fullscreen-btn" onClick={toggleFullscreen}>
        {isFullscreen ? "Exit" : "Fullscreen"}
      </button>

      <h1>NEXT RACE</h1>

      {showPaddockMessage && (
        <div className="paddock-message">
          Drivers — please proceed to the paddock
        </div>
      )}

      {nextSession ? (
        <SessionListing nextSession={nextSession} />
      ) : (
        <p className="no-sessions">No upcoming sessions</p>
      )}
    </div>
  );
};

export default NextRace;