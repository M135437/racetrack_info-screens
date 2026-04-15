import { useState, useEffect, useRef } from "react";
import EVENTS from "../../shared/events.js"
import { socket } from "../../socket/socket";
// useRef on nuppude cooldown tarbeks

import { useRaceState } from "../../hooks/useRaceState";
import "./LapTracker.css";

// import FlagDisplay from "../../components/FlagDisplay";
import Timer from "../../components/Timer";

const LapTracker = () => {

    const { raceMode, leaderboard, listenSocket } = useRaceState();
    const [now, setNow] = useState(Date.now());
    const [cooldowns, setCooldowns] = useState([]);
    const cooldownsRef = useRef([]); // <-automaatuuendus ilma lehte renderimata;
    // väldib nupuloogikal "hangumist"; varasemalt üks nupp muutus aktiivseks alles siis,
    // kui vahepeal mõnd muud nuppu vajutada

    useEffect(() => {
        listenSocket();
        const interval = setInterval(() => setNow(Date.now()), 10);
        return () => clearInterval(interval);
    }, []);

    // nb! handlerecordlap pole OTSESELT vajalik ja saaksin recordLap
    // funktsiooni kutsuda esile ka react return sees.
    // AGA! kui tahta kliendipoolel lisada efekte vms, siis tuleb kasuks
    // ja handlerecordlap kasutusel pole vaja hook-ist eraldi recordLap-i võtta!
    const handleRecordLap = (id) => { // id, millest saame returnis react.id
        // testimiseks:
        console.log(`Client clicking Car ID: ${id}`);

        if (cooldownsRef.current.includes(id)) { // <- cooldown-kontroll, mis
            // ei luba vajutust, kui cooldwon state-is
            console.log(`button for car ${id} blocked by cooldown!`);
            return; // testimise abiks logitekst
        };

        // ref-i lisamine:
        cooldownsRef.current.push(id);
        // css tarbeks state:
        setCooldowns([...cooldownsRef.current]);

        socket.emit(EVENTS.LAP_UPDATE, {
            sessionId: runningRace, // <- runningRace on hook-is, aga kuna see on state, siis ei pruugi olla kõige uuem väärtus, seega võiks kasutada ka useRef-i selle jaoks
            carId: id
        }); // andmete muutuse
        // edastamine nupuvajutusel

        // cooldown-ist väljumine:
        setTimeout(() => { // id põhjal filtreerime cooldowns-i pandud sõiduki VÄLJA:
            cooldownsRef.current = cooldownsRef.current.filter((carId) => carId !== id);

            // uuendame, et väljuda edukalt cooldownist:
            setCooldowns([...cooldownsRef.current]);
        }, 5000);
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

    // kuna nupud on klikatavad ÜHE KORRA ka finishi ajal, siis:
    const isFinishing = raceMode === "finish";

    // sõitjate leidmine:
    const cars = leaderboard || [];

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
            <div className="component-zone">
                {/*<div className="flag-wrapper">
                    <FlagDisplay status={raceMode} />
                </div> */}
                <div className="timer-wrapper">
                    <Timer />
                </div>
            </div>
            {/* kontrollime, kas nii taimer kui stopper töötavad */}
            <div className="debug-timer">
                <p>Local high-res: {formatLapDisplay(now / 1000)}</p>
                <p>Mode: {raceMode || "N/A"}</p>
            </div>
            {!isRaceActive ? ( // ternary et nuppude asemel oleks
                // sessioonide vahel tekst:
                <div className="waiting-screen">
                    <p>Waiting for the next race to begin..</p>
                </div>
            ) : (
                <div className="cars-grid">
                    {/* nb! lisa ka vastav klass css-i, ühes display:flex-iga!! */}
                    {cars.map((driver) => (
                        <div key={driver.id} className="lap-tracker-ui">

                            <button
                                onClick={() => handleRecordLap(driver.id)/*handleRecordLap(driver.id)*/}
                                disabled={!isRaceActive || // obsolete?
                                    driver.isFinished ||
                                    cooldowns.includes(driver.id)}

                                className={`lap-button ${!isRaceActive ||
                                    driver.isFinished ||
                                    cooldowns.includes(driver.id) ? "disabled" : "active"}`}
                            >
                                {driver.isFinished ? `${driver.car} FINISHED` : `car ${driver.car} | `}
                                {/* nupud peavad kuvama SÕIDUKI NR, mitte sõitja nime */}
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

// muudame app.jsx-ile nähtavaks:
export default LapTracker;