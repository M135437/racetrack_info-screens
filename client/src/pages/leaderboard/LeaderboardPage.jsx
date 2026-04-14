import React from "react";
import "./LeaderboardPage.css";
import { useRaceState } from "../../hooks/useRaceState";
import Timer from "../../components/Timer";

const Leaderboard = () => {
  // kõik andmed tulevad hookist — ei ole vaja socketit otse kuulata
  const { time, leaderboard, raceMode, listenSocket } = useRaceState();

  // käivita socket kuulajad üks kord
  React.useEffect(() => {
    listenSocket();
  }, []);

  // sorteerime kiireima ringiaja järgi
  const sortedLeaderboard = [...(leaderboard || [])].sort((a, b) => {
    if (!a.bestLapTime) return 1;
    if (!b.bestLapTime) return -1;
    return a.bestLapTime - b.bestLapTime; // millisekundid — lihtne numbriline sort!
  });

  return (
    <div className="next-race-container">
      <header className="leaderboard-header">
        <h2>LEADERBOARD</h2>
        // PÄRAST:
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
          <span>FASTEST</span>
        </div>

        {sortedLeaderboard.length === 0 ? (
          // kui leaderboard tühi — näita mock andmeid kuni race algab
          <div className="table-row">
            <span>-</span>
            <span>Waiting for race...</span>
            <span>-</span>
            <span>-</span>
            <span>--:--.-</span>
          </div>
        ) : (
          sortedLeaderboard.map((racer, index) => (
            <div className="table-row" key={racer.id || index}>
              <span>{index + 1}</span>
              <span>{racer.name}</span>
              <span>{racer.car}</span>
              <span>{racer.lapCount}</span>
              <span className={index === 0 ? "best" : ""}>
                {racer.bestLapTime
                  ? `${String(Math.floor(racer.bestLapTime / 60000)).padStart(
                      2,
                      "0"
                    )}:${String(
                      Math.floor((racer.bestLapTime % 60000) / 1000)
                    ).padStart(2, "0")}.${String(
                      racer.bestLapTime % 1000
                    ).slice(0, 1)}`
                  : "--:--.-"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
