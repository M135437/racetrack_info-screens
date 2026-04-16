import { useState, useEffect, useRef } from "react"; 
import EVENTS from "../../shared/events.js"
import { socket } from "../../socket/socket";
import { useRaceState } from "../../hooks/useRaceState";
import "./LapTracker.css";
import Timer from "../../components/Timer";

const LapTracker = () => {

    const { raceMode, leaderboard, listenSocket} = useRaceState();
    const [now, setNow] = useState(Date.now());
    const [cooldowns, setCooldowns] = useState([]);
    const cooldownsRef = useRef([]);

    useEffect(() => {
        listenSocket();
        const interval = setInterval(() => setNow(Date.now()), 10);
        return () => clearInterval(interval);
    }, []);

    const handleRecordLap = (id) => {
        // testimiseks:
        console.log(`Client clicking Driver ID: ${id}`);

        if (cooldownsRef.current.includes(id)) {
            console.log(`button for driver ${id} blocked by cooldown!`);
            return; 
        };

        cooldownsRef.current.push(id);
        setCooldowns([...cooldownsRef.current]);

        socket.emit(EVENTS.LAP_UPDATE, id);
        
        setTimeout(() => { 
            cooldownsRef.current = cooldownsRef.current.filter((carId) => carId !== id);
            setCooldowns([...cooldownsRef.current]);
        }, 1000);
    };

    const formatLapDisplay = (lapTime) => {
    if (!lapTime) return "--:--:---";

    const totalSeconds = parseFloat(lapTime);
    const mins = Math.floor(totalSeconds / 60);
    const secs = (totalSeconds % 60).toFixed(3);

    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(6, "0")}`;
  };

  const activeModes = ["safe", "hazard", "danger", "finish"];
  const isRaceActive = activeModes.includes(raceMode);

  const drivers = leaderboard || [];

  // ajutine laptracker-ui-spetsiifiline täisekraaninupp
    function toggleFullScreen() {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen(); 
    }

    return (
        <div className="lap-container">
            <div> {/* ajutine lt-spetsiifiline fullscreen: */}
                <button onClick={() => toggleFullScreen()}
                className="fullscreen">Fullscreen</button>
            </div>
            <h1>Lap Tracker</h1>
            {raceMode !== "notStarted" ? (
            <div className="component-zone">
                <div className={`race-status ${raceMode}`}>
                STATUS: {(raceMode).toUpperCase()}
                </div>
                <div className="timer-wrapper">
                    <Timer />
                </div>
            </div>
            ) : null}
            {/* kontrollime, kas nii taimer kui stopper töötavad 
            <div className="debug-timer">
                <p>Local high-res: {formatLapDisplay(now / 1000)}</p>
            </div> */}
            {!isRaceActive ? (
                <div className="waiting-screen">
                    <p>
                        {raceMode === "notStarted"
                        ? "Waiting for the first race to begin.."
                        : "Waiting for the next race to begin.."}
                    </p>
                </div>
            ) : (
            <div className="drivers-grid">
            {drivers.map((driver) => (
                <div key={driver.id} className="lap-tracker-ui">

                    <button
                        onClick={() => handleRecordLap(driver.id)}
                        disabled={
                            driver.isFinished ||
                            cooldowns.includes(driver.id)
                        }
                        className={`lap-button ${
                            driver.isFinished ||
                            cooldowns.includes(driver.id) ? "cooling" : "active"}`}
                    >
                        {driver.isFinished ? `${driver.car} FINISHED` : `car ${driver.car} | `}
                        <span>Laps: {driver.lapCount} | Last time: {formatLapDisplay(driver.latestLapTime)} | Best: {formatLapDisplay(driver.fastestLap) || "--"}
                        </span>
                    </button>
                </div>
            ))}
        </div>
        )}
        </div>
    );
};

export default LapTracker;