import { useEffect, useState } from "react";
import "./Flags.css";
import { socket } from "../../socket/socket";
import EVENTS from "../../shared/events";
import { RACE_MODES } from "../../shared/types";

const Flags = () => {
  // Algseis on DANGER (punane), kuni serverist tuleb uus info
  const [currentMode, setCurrentMode] = useState(RACE_MODES.ENDED);

  useEffect(() => {
    // Kuulame MODE_CHANGED sündmust (backend -> UI)
    socket.on(EVENTS.MODE_CHANGED, (newMode) => {
      console.log("Lipu režiim muutus:", newMode);
      // Eeldame, et server saadab režiimi nime (safe, hazard jne)
      setCurrentMode(newMode);
    });

    // Puhastame ühenduse, kui komponent suletakse
    return () => {
      socket.off(EVENTS.MODE_CHANGED);
    };
  }, []);

  // Funktsioon õige CSS klassi leidmiseks vastavalt types.js väärtustele
  const getFlagClass = () => {
    switch (currentMode) {
      case RACE_MODES.SAFE:
        return "flag-safe"; // Roheline
      case RACE_MODES.HAZARD:
        return "flag-hazard"; // Kollane
      case RACE_MODES.DANGER:
        return "flag-danger"; // Punane
      case RACE_MODES.FINISH:
        return "flag-finish"; // Ruuduline
      case RACE_MODES.ENDED:
        return "flag-danger"; // Kui sessioon läbi, siis punane
      default:
        return "flag-danger";
    }
  };

  return (
    <div className={`flags-container ${getFlagClass()}`}>
      <div className="fullscreen-btn-wrapper">
        <button onClick={() => document.documentElement.requestFullscreen()}>
          💻 Fullscreen
        </button>
      </div>
      
      <div className="flag-content">
        {/* Kuvame teksti suurelt (nt SAFE, HAZARD) */}
        <h1 className="mode-text">{currentMode.toUpperCase()}</h1>
        
        {/* Kui on finiš, lisame CSS-iga ruudustiku efekti */}
        {currentMode === RACE_MODES.FINISH && (
          <div className="chequered-overlay"></div>
        )}
      </div>
    </div>
  );
};

export default Flags;