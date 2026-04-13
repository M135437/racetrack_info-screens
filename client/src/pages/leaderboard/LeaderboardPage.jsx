import React, { useEffect, useState } from "react";
import "./LeaderboardPage.css";
import { socket } from "../../socket/socket";
import EVENTS from "../../shared/events";
import { RACE_MODES } from "../../shared/types";
import Timer from "../../components/Timer";

// Mock andmed — kuvatakse ainult kui server ei saada andmeid
const initialMockData = {
    racers: [
        { id: 1, car: "Car 01", driver: "Alex", lapCount: 5, fastestLap: "01:12.4" },
        { id: 2, car: "Car 05", driver: "Matu", lapCount: 5, fastestLap: "01:10.2" },
        { id: 3, car: "Car 08", driver: "Kalev", lapCount: 4, fastestLap: "01:15.8" },
    ],
    status: RACE_MODES.SAFE,
    timeLeft: 525000  // millisekunditena (8 min 45 sek)
};

// Leaderboardi komponent
const Leaderboard = () => {
    const [timerData, setTimerData] = useState(initialMockData);

    useEffect(() => {
        // Kuulame serveri taimerit — uuendab kogu leaderboardi
        socket.on(EVENTS.TIMER_UPDATE, (newData) => {
            console.log("TIMER_UPDATE saabus:", newData);
            setTimerData(newData);
        });

        // Kuulame režiimi muutust — uuendab ainult staatust
        socket.on(EVENTS.MODE_CHANGED, (newMode) => {
            setTimerData(prev => ({ ...prev, status: newMode }));
        });

        // Kuulame ringiaegade uuendust — uuendab ainult sõitjaid
        socket.on(EVENTS.LAP_UPDATED, (updatedRacers) => {
            console.log("LAP_UPDATED saabus:", updatedRacers);
            // setTimerData(prev => ({ ...prev, racers: updatedRacers }));
            // ⬆️ kommenteeritud kuni Mariga kokku lepime mis formaat tuleb
        });

        // Puhastame kuulajad kui komponent suletakse
        return () => {
            socket.off(EVENTS.TIMER_UPDATE);
            socket.off(EVENTS.MODE_CHANGED);
            socket.off(EVENTS.LAP_UPDATED);
        };
    }, []);

    // Teisendab "01:12.4" millisekunditeks — õige numbriline sortimine
    const lapToMs = (lap) => {
        if (!lap) return Infinity;
        const [mins, rest] = lap.split(":");
        return parseFloat(mins) * 60000 + parseFloat(rest) * 1000;
    };

    // Sorteerime kiireima ringiaja järgi
    const sortedRacers = [...timerData.racers].sort((a, b) => {
        return lapToMs(a.fastestLap) - lapToMs(b.fastestLap);
    });

    return (
        <div className="next-race-container">
            <header className="leaderboard-header">
                <h2>LEADERBOARD</h2>

                {/* Staatuse badge — värv muutub koos lipuga */}
                <div className={`race-status ${timerData.status}`}>
                    STATUS: {timerData.status?.toUpperCase()}
                </div>

                {/* Taimer — kasutab Mihkli Timer komponenti */}
                <div className="race-timer">
                    TIME LEFT: <Timer time={timerData.timeLeft} />
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
                        {/* Esimene koht roheline highlight */}
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