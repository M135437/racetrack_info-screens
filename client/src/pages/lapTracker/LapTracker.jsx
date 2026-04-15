import { useState, useEffect, useRef } from "react"; 
import EVENTS from "../../shared/events.js"
import { socket } from "../../socket/socket";
// useRef on nuppude cooldown tarbeks

// HOOK saamaks taimeri-stopperi infot (lb saab sealt ka stopperi kuva)
import { useRaceState } from "../../hooks/useRaceState";
import "./LapTracker.css";

// import FlagDisplay from "../../components/FlagDisplay";
import Timer from "../../components/Timer";

const LapTracker = () => {

    const { raceMode, leaderboard, recordLap, listenSocket} = useRaceState();
    const [now, setNow] = useState(Date.now());
    const [cooldowns, setCooldowns] = useState([]); // <- lokaalne state nupu
    // keelamiseks vahetult pärast klikki
    const cooldownsRef = useRef([]); // <-automaatuuendus ilma lehte renderimata;
    // väldib nupuloogikal "hangumist"; varasemalt üks nupp muutus aktiivseks alles siis,
    // kui vahepeal mõnd muud nuppu vajutada

    // kuna HOOK, siis vaid 1 useEffect, et hooki kuulata (mount):
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
        console.log(`Client clicking Driver ID: ${id}`);

        if (cooldownsRef.current.includes(id)) { // <- cooldown-kontroll, mis
        // ei luba vajutust, kui cooldwon state-is
            console.log(`button for driver ${id} blocked by cooldown!`);
            return; // testimise abiks logitekst
        };

        // ref-i lisamine:
        cooldownsRef.current.push(id);
        // css tarbeks state:
        setCooldowns([...cooldownsRef.current]);

        socket.emit(EVENTS.LAP_UPDATE, id); // andmete muutuse
        // edastamine nupuvajutusel
        
        // cooldown-ist väljumine:
        setTimeout(() => { // id põhjal filtreerime cooldowns-i pandud sõiduki VÄLJA:
            cooldownsRef.current = cooldownsRef.current.filter((carId) => carId !== id);

            // uuendame, et väljuda edukalt cooldownist:
            setCooldowns([...cooldownsRef.current]);
        }, 5000);
    };

    // ei hakanud praegu alias-eid kasutama, et importida utilsist
    // stopperile vormingut, aga pika jadaga path ka ei toiminud, seega
    // teen ajutiselt siia uue vormindaja:
    const formatLapDisplay = (lapTime) => {
    if (!lapTime) return "--:--:---";

    const totalSeconds = parseFloat(lapTime); // millisekundid arvuna loetavaks
    const mins = Math.floor(totalSeconds / 60);
    const secs = (totalSeconds % 60).toFixed(3);

    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(6, "0")}`;
  };

  // esmane nupuvajutusluba -
  // kui POLE ALANUD ja kui POLE SESS LÕPPENUD, siis 
  // on võistlus käimas ja nupud on kuvatud:
  const isRaceActive = raceMode !== "notStarted"; // && raceMode !== "ended";
  // (st nupud on safe, hazard, danger ja finish ajal olemas) 

  // kuna nupud on klikatavad ÜHE KORRA ka finishi ajal, siis:
  const isFinishing = raceMode === "finish";

  // sõitjate leidmine:
  const drivers = leaderboard || [];
//   const drivers = [{
//     id: 1,
//     name: "Pauli vend",
//     car: "11",
//     lapCount: 0,
//     latestLapTime: null,
//     fastestLap: null,
//     isFinished: false
//   },
//   {
//     id: 2,
//     name: "Pauli õde",
//     car: "22",
//     lapCount: 0,
//     latestLapTime: null,
//     fastestLap: null,
//     isFinished: false
//   },
//   {
//     id: 3,
//     name: "Pauli nõbu",
//     car: "33",
//     lapCount: 0,
//     latestLapTime: null,
//     fastestLap: null,
//     isFinished: false
//   }];

  // ajutine laptracker-ui-spetsiifiline täisekraaninupp
    function toggleFullScreen() {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen(); 
    }

    // pärisandmed vs võltsandmed:
//const displayData = incomingStateData || mockData;

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
                {/*<p>Status: {isLoading ? "Syncing with server.." : "Connected"}</p>*/}
            </div>
            {/* nö ootereiim kui sess pole alanud: */}
            {!isRaceActive ? ( // ternary et nuppude asemel oleks
            // sessioonide vahel tekst:
                <div className="waiting-screen">
                    <p>Waiting for the next race to begin..</p>
                </div>
            ) : (
            <div className="drivers-grid">
            {/* nb! lisa ka vastav klass css-i, ühes display:flex-iga!! */}
            {drivers.map((driver) => (
                <div key={driver.id} className="lap-tracker-ui">

                    <button
                        onClick={() => recordLap(driver.id)/*handleRecordLap(driver.id)*/}
                        disabled={!isRaceActive || // obsolete?
                            driver.isFinished ||
                            cooldowns.includes(driver.id)}
                        
                        className={`lap-button ${
                            !isRaceActive || 
                            driver.isFinished ||
                            cooldowns.includes(driver.id) ? "disabled" : "active"}`}
                    >
                        {driver.isFinished ? `${driver.car} FINISHED` : `car ${driver.car} | `}
                        {/* nupud peavad kuvama SÕIDUKI NR, mitte sõitja nime */}
                        <span>Laps: {driver.lapCount} | Last time: {formatLapDisplay(driver.latestLapTime / 1000)} | Best: {formatLapDisplay(driver.fastestLap / 1000) || "--"}
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