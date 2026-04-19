import { useEffect, useState } from "react";
import "./Flags.css";
import { useRaceState } from "../../hooks/useRaceState";
import { RACE_MODES } from "../../shared/types";

const Flags = () => {
  const { raceMode, listenSocket } = useRaceState();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    listenSocket();
  }, []);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const flagClassMap = {
    [RACE_MODES.SAFE]: "flag-safe",
    [RACE_MODES.HAZARD]: "flag-hazard",
    [RACE_MODES.DANGER]: "flag-danger",
    [RACE_MODES.FINISH]: "flag-finish",
    [RACE_MODES.ENDED]: "flag-danger"
  };

  const flagClass = flagClassMap[raceMode] || "flag-danger";

  return (
    <div className={`flags-container ${flagClass}`}>
      
      {/* Fullscreen toggle */}
      <div className="fullscreen-btn-wrapper">
        <button onClick={toggleFullscreen}>
          {isFullscreen ? "Exit" : "Fullscreen"}
        </button>
      </div>

      {raceMode === RACE_MODES.FINISH && (
        <div className="chequered-overlay" />
      )}
    </div>
  );
};

export default Flags;