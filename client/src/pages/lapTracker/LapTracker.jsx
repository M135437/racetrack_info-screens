// NB! esialgu jätan õpikommentaarid sisse, aga enne main-i
// merge-i võtan maha (mul on nii lihtsam õppida)

/* react-iga ui tagastamine */

// IMPORDID
// react-tööriistad kuva kirjutamaks:
import React from "react";
// HOOK saamaks taimeri-stopperi infot (lb saab sealt ka stopperi kuva)
import { useRaceState } from "../../hooks/useRaceState";
// ühendus serveriga, sest lt ui ka SAADAB infot (nupuvajutused)
import { socket } from "../../socket/socket";
// kujundus
import "./LapTracker.css";

// impording ka lipukese komponendi (tahan :D)
// automaatselt rakendub imporditud komponendil talle kirjutatud css
// import FlagDisplay from "../components/FlagDisplay";

const LapTracker = () => {

    // võtame HOOK-ilt vajalikud andmed:
    const { timerData, now, recordLap } = useRaceState();

    // safeguard, kui timerData? kontroll võtab aega (ja ei taha
    // , et lehekülg näeks hangunud välja/laeks 100a):
    if (!timerData) return <div className="lap-container">Connecting...</div>

    // nb! handlerecordlap pole OTSESELT vajalik ja saaksin recordLap
    // funktsiooni kutsuda esile ka react return sees.
    // AGA! kui tahta kliendipoolel lisada efekte vms, siis tuleb kasuks
    // ja handlerecordlap kasutusel pole vaja hook-ist eraldi recordLap-i võtta!
    const handleRecordLap = (id) => { // id, millest saame returnis react.id
        // testimiseks:
        console.log(`Client clicking Racer ID: ${id}`);
        socket.emit("record-lap", id);
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

    return (
        <div className="lap-container">
            { /* <FlagDisplay status={timerData?.raceMode} /> */ }
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
            <div className="racers-grid">
            {/* nb! lisa ka vastav klass css-i, ühes display:flex-iga!! */}
            {timerData?.racers.map((racer) => (
            // map-meetod ise kontrollib alguses ?-ga, kas timerData info
            // on olemas - SEE TÄHENDAB, et racer-spetsiifilise info 
            // kontrollimine timerData?-ga ei ole enam vajalik (küll aga
            // jätkuvalt vja kontrollida asju nagu canLap jne, sest on 
            // sõitja-objekti välised muundujad
                <div key={racer.id} className="lap-tracker-ui">

                    <button
                        onClick={() => handleRecordLap(racer.id)} // kasutame ülapool ära
                        // märgitud uut const-i, mis edastaks socketile emit-i
                        // (VANA single-ui vers: peame siin info
                        // emit-i välja kirjutama; nb! serveris argument "racerId", aga siin map-i kaudu objektist saadud "racer.id"
                        /* enne mitmiknupuversiooni oli disabled={!timerData?.canLap} )*/
                        disabled={!timerData?.hasStarted || racer.isFinished}
                        className={`lap-button ${!timerData?.hasStarted || racer.isFinished ? "disabled" : "active"}`}
                    >
                        {racer.isFinished ? `${racer.car} FINISHED` : racer.car}
                        {/* nupud peavad kuvama SÕIDUKI NR, mitte sõitja nime */}
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