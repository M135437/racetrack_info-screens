import React, { useEffect, useState } from "react";
import "./LeaderboardPage.css";
import { socket } from "../../socket/socket";
import EVENTS from "../../shared/events";
import { RACE_MODES } from "../../shared/types";

// Mock andmed jäävad alles juhuks, kui server on maas
const initialMockData = {
    racers: [
        { id: 1, car: "Car 01", driver: "Alex", lapCount: 5, fastestLap: "01:12.4" },
        { id: 2, car: "Car 05", driver: "Matu", lapCount: 5, fastestLap: "01:10.2" },
        { id: 3, car: "Car 08", driver: "Kalev", lapCount: 4, fastestLap: "01:15.8" },
    ],
    status: RACE_MODES.SAFE,
    timeLeft: "08:45"
};

const Leaderboard = () => {
    const [timerData, setTimerData] = useState(initialMockData);

    useEffect(() => {
        // Kuulame serveri "heartbeat" sündmust
        socket.on(EVENTS.TIMER_UPDATE, (newData) => {
            console.log("Leaderboard uuendus:", newData);
            setTimerData(newData);
        });

        // Kuulame ka režiimi muutust (et taustavärv muutuks koos lippudega)
        socket.on(EVENTS.MODE_CHANGED, (newMode) => {
            setTimerData(prev => ({ ...prev, status: newMode }));
        });

        return () => {
            socket.off(EVENTS.TIMER_UPDATE);
            socket.off(EVENTS.MODE_CHANGED);
        };
    }, []);

    // ✅ SORTING - kiirem ringiaeg eespool
    const sortedRacers = [...timerData.racers].sort((a, b) => {
        if (!a.fastestLap) return 1;
        if (!b.fastestLap) return -1;
        return a.fastestLap.localeCompare(b.fastestLap);
    });

    return (
        <div className="next-race-container">
            <header className="leaderboard-header">
                <h2>LEADERBOARD</h2>

                {/* Dünaamiline klass vastavalt RACE_MODES tüübile */}
                <div className={`race-status ${timerData.status}`}>
                    STATUS: {timerData.status?.toUpperCase()}
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
                    <div className="table-row" key={racer.id || index}>
                        <span>{index + 1}</span>
                        <span>{racer.driver}</span>
                        <span>{racer.car}</span>
                        <span>{racer.lapCount}</span>

                        <span className={index === 0 ? "best" : ""}>
                            {racer.fastestLap || "--:--.-"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;