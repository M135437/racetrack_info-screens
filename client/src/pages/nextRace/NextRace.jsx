import { useEffect, useState } from "react";
import "./NextRace.css";
import { useRaceState } from "../../hooks/useRaceState";
import { socket } from "../../socket/socket";
import EVENTS from "../../shared/events";
import SessionListing from "../../components/SessionListing";
import { RACE_MODES } from "../../shared/types";

const NextRace = () => {
  const { raceMode } = useRaceState();

  const [nextRace, setNextRace] = useState(null);
  const [lastResults, setLastResults] = useState([]);

  useEffect(() => {
    const handleNextRace = (data) => setNextRace(data);
    const handleResults = (data) => setLastResults(data);

    socket.on(EVENTS.NEXT_RACE, handleNextRace);
    socket.on(EVENTS.LEADERBOARD_UPDATE, handleResults);

    return () => {
      socket.off(EVENTS.NEXT_RACE, handleNextRace);
      socket.off(EVENTS.LEADERBOARD_UPDATE, handleResults);
    };
  }, []);

  const showPaddockMessage = raceMode === RACE_MODES.ENDED;

  return (
    <div className="next-race-container">
      <button
        className="fullscreen-btn"
        onClick={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        }}
      >
        Fullscreen
      </button>

      <div className="yellow-line" />

      <h1>NEXT RACE</h1>

      {showPaddockMessage && (
        <div className="paddock-message">
          Drivers — please proceed to the paddock
        </div>
      )}

      {nextRace ? (
        <SessionListing nextSession={nextRace} />
      ) : (
        <p className="no-sessions">No upcoming sessions</p>
      )}

      {showPaddockMessage && lastResults.length > 0 && (
        <div className="last-results">
          <h3>Last race results</h3>

          {lastResults.slice(0, 5).map((driver, index) => (
            <div key={driver.id || index} className="result-row">
              <span>{index + 1}</span>
              <span>{driver.name}</span>
              <span>{driver.car}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NextRace;
