import React from "react";
import "./LeaderboardPage.css";

const mockTimerData = {
    racers: [
        { id: 1, car: "Car 01", driver: "Alex", lapCount: 5, fastestLap: "01:12.4" },
        { id: 2, car: "Car 05", driver: "Matu", lapCount: 5, fastestLap: "01:10.2" },
        { id: 3, car: "Car 08", driver: "Kalev", lapCount: 4, fastestLap: "01:15.8" },
    ],
    status: "safe",
    timeLeft: "08:45"
};

const Leaderboard = () => {

    const timerData = mockTimerData;

    // ✅ SORTING
    const sortedRacers = [...timerData.racers].sort(
        (a, b) => a.fastestLap.localeCompare(b.fastestLap)
    );

    return (
        <div className="leaderboard-container">
            <header className="leaderboard-header">
                <h2>LEADERBOARD</h2>

                {/* STATUS dünaamiline class */}
                <div className={`race-status ${timerData.status}`}>
                    STATUS: {timerData.status.toUpperCase()}
                </div>

                <div className="race-timer">
                    TIME LEFT: {timerData.timeLeft}
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

                {sortedRacers.map((racer, index) => (
                    <div className="table-row" key={racer.id}>
                        <span>{index + 1}</span>
                        <span>{racer.driver}</span>
                        <span>{racer.car}</span>
                        <span>{racer.lapCount}</span>

                        <span className={index === 0 ? "best" : ""}>
                            {racer.fastestLap}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;