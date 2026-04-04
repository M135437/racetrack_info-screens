import React from "react";
import "./LeaderboardPage.css";

// MOCK DATA - Need on ajutised andmed, et saaksid frontendi ehitada
// Kui Dev2 saab oma osa valmis, vahetame selle päris andmete vastu ringi
const mockTimerData = {
    racers: [
        { id: 1, car: "Car 01", driver: "Heilika", lapCount: 5, fastestLap: "01:12.4" },
        { id: 2, car: "Car 05", driver: "Olga", lapCount: 5, fastestLap: "01:10.2" },
        { id: 3, car: "Car 08", driver: "Siri", lapCount: 4, fastestLap: "01:15.8" },
    ],
    status: "safe",
    timeLeft: "08:45"
};

const Leaderboard = () => {
    // Kasutame hetkel mock-andmeid, mitte useRaceState hooki
    const timerData = mockTimerData; 

    return (
        <div className="leaderboard-container">
            <header className="leaderboard-header">
                <h2>LEADERBOARD</h2>
                <div className="race-status">STATUS: {timerData.status.toUpperCase()}</div>
                <div className="race-timer">TIME LEFT: {timerData.timeLeft}</div>
            </header>

            <div className="leaderboard-table">
                <div className="table-header">
                    <span>POS</span>
                    <span>DRIVER</span>
                    <span>CAR</span>
                    <span>LAPS</span>
                    <span>FASTEST</span>
                </div>
                
                {timerData.racers.map((racer, index) => (
                    <div className="table-row" key={racer.id}>
                        <span>{index + 1}</span>
                        <span>{racer.driver}</span>
                        <span>{racer.car}</span>
                        <span>{racer.lapCount}</span>
                        <span>{racer.fastestLap}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;