// NB! esialgu jätan õpikommentaarid sisse, aga enne main-i
// merge-i võtan maha (mul on nii lihtsam õppida)

/* react-iga ui tagastamine */

// NB! ilmselt tuleb muudatus, kus:
// võistlus ise -> session
// racer -> driver

// IMPORDID
// react-tööriistad kuva kirjutamaks:
import { useState, useEffect } from "react";
// HOOK saamaks taimeri-stopperi infot (lb saab sealt ka stopperi kuva)
// import { useRaceState } from "../../hooks/useRaceState"; (meil puudub??)
// ühendus serveriga, sest lt ui ka SAADAB infot (nupuvajutused)
import { socket } from "../../socket/socket";
// import { io } from "socket.io-client"; // <- eelnevalt testimiseks otse siia socketid
const socket = io("http://localhost:5000"); // <- sandbox port
// kujundus
import "./LapTracker.css";

// impording eventid:
import EVENTS from "../../shared/events.js";

// impordin ka lipukese komponendi (tahan :D)
// automaatselt rakendub imporditud komponendil talle kirjutatud css
// import FlagDisplay from "../components/FlagDisplay";
// import Timer from "../components/Timer";

    // vaatasin, et olgal oli kasutusel export default function, mitte const:
const LapTracker = () => {

    // võtame HOOK-ilt vajalikud andmed:
    // const { timerData, now, recordLap } = useRaceState();
    const [timerData, setTimerData] = useState(null);
    const [now, setNow] = useState(Date.now());

    useEffect(() => { // stopperivisuaaliks
        const interval = setInterval(() => setNow(Date.now()), 10);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("ühendus serveriga loodud");
        });
        socket.on("connect_error", (err) => {
            console.error("ühendus nurjus", err.message);
        });
    }, []);

    // kuulajad (esialgu mock-sõidule):
    useEffect(() => {
        /* kommenteerin välja test-faasi käiviti:
        // esmaühendusel
        socket.on("lap:init", (initialRacers) => {
            setTimerData({
                hasStarted: false,
                secondsLeft: 60,
                racers: initialRacers
            });
        }); */

        // sõidu algamisel
        socket.on(EVENTS.SESSION_STARTED, (fullState) => {
            setTimerData(fullState);
        });
        // ühe võistleja jooneületusel
        socket.on(EVENTS.LAP_UPDATED, (updatedDriver) => {
            setTimerData(prev => {
                if (!prev) return prev;
                const newDrivers = prev.drivers.map(d =>
                    d.id === updatedDriver.id ? updatedDriver : d
                );
                return { ...prev, drivers: newDrivers };
            });
        });

        return () => {
            // socket.off("lap:init"); <- testfaasi event
            socket.off(EVENTS.SESSION_STARTED);
            socket.off(EVENTS.LAP_UPDATED);
        };
    }, []);
    
    // testimiseks webdev konsooli andmeoutput ka:
    useEffect(() => {
        if (timerData) {
            console.log("Current stats: ", timerData.drivers);
        }
    }, [timerData]);

    //testimiseks trackerisse sisse
    // safeguard, kui timerData? kontroll võtab aega (ja ei taha
    // , et lehekülg näeks hangunud välja/laeks 100a):
    if (!timerData) return <div className="lap-container">Connecting...</div>

    // nb! handlerecordlap pole OTSESELT vajalik ja saaksin recordLap
    // funktsiooni kutsuda esile ka react return sees.
    // AGA! kui tahta kliendipoolel lisada efekte vms, siis tuleb kasuks
    // ja handlerecordlap kasutusel pole vaja hook-ist eraldi recordLap-i võtta!
    const handleRecordLap = (id) => { // id, millest saame returnis react.id
        // testimiseks:
        console.log(`Client clicking Driver ID: ${id}`);
        socket.emit(EVENTS.LAP_UPDATE, id); // andmete muutuse
        // edastamine nupuvajutusel
    };

    // ei hakanud praegu alias-eid kasutama, et importida utilsist
    // stopperile vormingut, aga pika jadaga path ka ei toiminud, seega
    // teen ajutiselt siia uue vormindaja:
    const formatLapDisplay = (lapTime) => {
    if (!lapTime) return "--:--:---";

    /* pre-leaderboard vana:
    if (!lapTime) { // juhul kui rajaaega veel pole, siis, KAS:
      return timerData?.hasStarted ? "Awaiting first pass.." : "Waiting for race to start...";
    } */

    const totalSeconds = parseFloat(lapTime); // millisekundid arvuna loetavaks
    const mins = Math.floor(totalSeconds / 60);
    const secs = (totalSeconds % 60).toFixed(3);

    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(6, "0")}`;
  };

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
            { /* kuhugi ui päisesse saan oma äranägemise järgi mahutada
            ohutuslipu /ja vb taimer?);
             tuleks luua eraldi konteiner, mille suurust/paigutust saan OMA
            css-is hallata:
            <div className="component-zone">
                <div className="flag-wrapper">
                    <FlagDisplay status={timerData?.raceMode} />
                </div>
                <div className="timer-wrapper">
                    <Timer seconds={timerData?.secondsLeft} />
                </div>
            </div>
            */}
            {/* kontrollime, kas nii taimer kui stopper töötavad */}
            <div className="debug-timer">
                <h2>Time left: {timerData?.secondsLeft}s</h2>
                <p>Local high-res: {formatLapDisplay(now / 1000)}</p>
            </div>
            {!timerData?.hasStarted ? ( // ternary et nuppude asemel oleks
            // sessioonide vahel tekst:
                <div className="waiting-screen">
                    <p>Waiting for the next race to begin..</p>
                </div>
            ) : (
            <div className="drivers-grid">
            {/* nb! lisa ka vastav klass css-i, ühes display:flex-iga!! */}
            {timerData?.drivers.map((driver) => (
            // map-meetod ise kontrollib alguses ?-ga, kas timerData info
            // on olemas - SEE TÄHENDAB, et racer-spetsiifilise info 
            // kontrollimine timerData?-ga ei ole enam vajalik (küll aga
            // jätkuvalt vja kontrollida asju nagu canLap jne, sest on 
            // sõitja-objekti välised muundujad
                <div key={driver.id} className="lap-tracker-ui">

                    <button
                        onClick={() => handleRecordLap(driver.id)} // kasutame ülapool ära
                        // märgitud uut const-i, mis edastaks socketile emit-i
                        // (VANA single-ui vers: peame siin info
                        // emit-i välja kirjutama; nb! serveris argument "racerId", aga siin map-i kaudu objektist saadud "racer.id"
                        /* enne mitmiknupuversiooni oli disabled={!timerData?.canLap} )*/
                        disabled={!timerData?.hasStarted || driver.isFinished}
                        className={`lap-button ${!timerData?.hasStarted || driver.isFinished ? "disabled" : "active"}`}
                    >
                        {driver.isFinished ? `${driver.car} FINISHED` : `car ${driver.car} | `}
                        {/* nupud peavad kuvama SÕIDUKI NR, mitte sõitja nime */}
                        <span>Laps: {driver.lapCount} | Last time: {driver.latestLapTime} | Best: {driver.fastestLap || "--"}
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