import React, { useEffect, useMemo } from "react";
import "./LeaderboardPage.css";
import { useRaceState } from "../../hooks/useRaceState";
import Timer from "../../components/Timer";

const Leaderboard = () => {
  // kõik andmed tulevad hookist — ei ole vaja socketit otse kuulata
  const { time, leaderboard, raceMode, listenSocket } = useRaceState();

  useEffect(() => {
    listenSocket();
  }, []);  // tühi array — ainult üks kord

// Sorteerime vastavalt Mari andmetele (fastestLap)
const sortedLeaderboard = useMemo(() => {
  if (!leaderboard) return [];
  return [...leaderboard].sort((a, b) => {
    const timeA = a.fastestLap || Infinity;
    const timeB = b.fastestLap || Infinity;
    return timeA - timeB;
  });
}, [leaderboard]);


// Funktsioon aja vormindamiseks (et säiliks MM:SS.ms vaade)
const formatTime = (seconds) => {
  if (!seconds || seconds === Infinity) return "--:--.---";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;

};

  return (

    <div className="leaderboard-container">
            {/* fullscreen nupp */}
            <button
                className="fullscreen-btn"
                onClick={() => document.documentElement.requestFullscreen()}
            >
                Fullscreen
            </button>

            <header className="leaderboard-header">
                <h2>LEADERBOARD</h2>
                <div className={`race-status ${raceMode || "notStarted"}`}>
                    STATUS: {(raceMode || "notStarted").toUpperCase()}
                </div>
                <div className="race-timer">
                    TIME LEFT: <Timer time={time} />
                </div>
            </header>

            <div className="leaderboard-table">
                <div className="table-header">
                    <span>POS</span>
                    <span>DRIVER</span>
                    <span>CAR</span>
                    <span>LAPS</span>
                    <span>LATEST</span>
                    <span>FASTEST</span>
                </div>

                {sortedLeaderboard.length === 0 ? (
                    <div className="table-row">
                        <span style={{ gridColumn: "span 6", textAlign: "center" }}>
                            Waiting for race data...
                        </span>
                    </div>
                ) : (
                    sortedLeaderboard.map((driver, index) => (
                        <div
                            className={`table-row ${index === 0 ? "best-row" : ""}`}
                            key={driver.id || index}
                        >
                            <span>{index + 1}</span>
                            <span>{driver.name}</span>
                            <span>{driver.car}</span>
                            <span>{driver.lapCount || 0}</span>
                            <span>{formatTime(driver.latestLapTime)}</span>
                            <span className={index === 0 ? "best" : ""}>
                                {formatTime(driver.fastestLap)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Leaderboard;