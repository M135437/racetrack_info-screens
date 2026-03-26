/* ==========> IMPORDID (react, socket, css) <========== */
import { useState, useEffect } from 'react'
/* useState - "mäletamaks" staatuseid (aja jääk taimeril)
useEffect - loogika
*/

import { io } from "socket.io-client";
import './App.css'

/* ==========> HOST-ile EDASTAMINE <========== */
const socket = io("http://localhost:3000"); // ühendus serveriga

/* ==========> RAKENDUSE KOGU SISU <========== */
// taimer-loogika, alustades dependency array-st:
function App() {

/* ==========> STAATUSE DEKLAAREERIMINE <========== */
  //edastame objekti, mis kätkeb endas kogu vajalikku infot taimeri tööks:
  
  /* esmane objekt, konkreetselt defineeritud algväärtustega:
    const [timerData, setTimerData] = useState({
    secondsLeft: 600,
    isPaused: true,
    hasStarted: false

  /* vanim nupueelne vers, kus serverile pidi saatma vaid arvu, mitte objekti:
  const [secondsLeft, setSecondsleft] = useState(600); // 600 sekundit */

  // käivitusel saadame tühjade andmetega objekti (vältimaks NaN ja muid
  // hetkelisi ebakõlasid serverite ühendumise hetkel)
  const [timerData, setTimerData] = useState(null);
  // KUI DEFINEERIME ILMA VÄÄRTUSETA OBJEKTI, SIIS PEAME return-IS KASUTAMA
  // "?" EHK "Optional Chaning". see tähendab, et JUHUL KUI objektil ON
  // väärtus, toimub kirjeldatud funktsioon (ei crashi puudulike andmete puhul)
  // süsteemi laienemisel väidetavalt hea lähenemine, sest objektile saab
  // lihtsalt omadusi/staatuseid juurde lisada ning neile kõigile pääseb
  // React-poolses koodis mugavalt ligi, lisamata uusi useState-isid

  // leaderboardi current lap millisekundi visuaali tarbeks:
  const [now, setNow] = useState(Date.now());

/* ==========> STAATUSE SISU VAHENDAMINE (heartbeat ise, nupud)  <========== */  
  useEffect(() => {
    // serveripoolse südametukse (e kogu andme-objekti) "kuulamine":
    socket.on("timer-tick", (data) => {
      setTimerData(data); // React auto-uuendab UI-d,
      // kui staatused muutuvad
    });

    // cleanup e "kuulaja sulgemine" komponendi sulgumisel
    // (mälulekke vastu, et taustal toimunud protsessid ei 
    // jääks lõputult loop-ima):
    return () => {
      socket.off("timer-tick");
    };
  }, []); // tühi array -> jooksuta vaid laadimisel 1x.

  // useEffect arvutamaks leaderboardi visuaali tarbeks current
  // lap-ile ka millisekundi kuva; pmst timestamp
  useEffect(() => {

    // pmst kliendipool "oletab" viimasest pulseeritud ajamärgisest
    // tulenevalt aja möödumise millisekundites kuni järgmise data-ni
    const ticker = setInterval(() => {
      setNow(Date.now());
    }, 50); // 50ms tagant edastamine sujuvaks visuaaliks
    
    return () => clearInterval(ticker); // loendamine lõpeb rakenduse sulgumisel
    }, []);
  

  // funktsioonid edastamaks infot host-serverile (react returnis kasutuseks):
  const toggleTimer = () => socket.emit("toggle-timer");
  const resetTimer = () => socket.emit("reset-timer");

  // sorteerime sõitjad ringikiiruse alusel, et kuvada lb-s:
  const sortedRacers = timerData?.racers // 
  ? [...timerData.racers].sort((a, b) => {
    // "..." loendi ees - Reacti 'Immutability' kontseptioon:
    //        ei muuda serveris olevat loendit, vaid loob serverist
    //        saadu põhjal uue loendi e KOOPIA, mida React oskab lehe kuvas
    //        uuesti "luua"/värskendada
    // a - hetkel vaadeldav ese (current item)
    // b - järgmisena vaadeldav ese (next item)
    // -1, 1, 0 on "matemaatilised juhised":
    // "-1" = see ese on "väiksem",
    // "1" = see ese on "suurem",
    // "0" = need esemed on võrdsed

    // parima aja saab kahe aja kõrvutamise ja nende seejärel lahutamise
    // tulemusena:
    if (a.bestLapTime !== null && b.bestLapTime !== null) {
      return a.bestLapTime - b.bestLapTime;
    }
    // et "null"-väärtus ei oleks liidrikohal:
    if (a.bestLapTime !== null) return -1; // kui esimesel võrreldaval ajal ON
    // väärtus, mitte "null" (nt pole esmaületust), siis neg nr on
    // väiksem, seega "kõrgemal kohal"
    
    if (b.bestLapTime !== null) return 1; // kui teisel võrreldaval ON
    // aeg, aga esimesel ei ole, siis jääb kõrgemale kohale.

    // kui kummalgi võrreldaval ei ole veel väärtust, siis järjekord ei muutu:
    return 0;

    //NB! vaatasin, et sama loogika oli ka lovable-i js-versioonis
  })
  : []; // tühja array tagastus, kui andmeid veel pole

  // argumendita nupuloogika sai määratleda const-ina, kuid kuna uus
  // mitme-nupu kood nõuab react return-is id-argumenti, mis on map() sees,
  // siis const ei saa seda ekstraheerida -
  // SEE TÄHENDAB id-d oleks const-le nähtavad (useState), aga react
  // return-is olev map määrab, MIS nupul MILLISE objektiga seos on ja
  // SEDA ei tea const ette)
  /* vana ühenupu "shortcut":
  const recordLap = () => socket.emit("record-lap"); */

/* ==========> TAIMERIKUVA VORMINGU LOOGIKA <========== */
  // 600sek "10:00"ks muutmine:
  const formatTime = (s) => {
    const totalSeconds = Number.isInteger(s) ? s : 0;
  // ( ja ka selleks et vältida võimalikku NaN kuvamist taimeri asemel, kui serverite
  // ühendumise hetkel on kerge ajaline lag/möödarääkivus)
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  /* ==========> STOPPERIKUVA VORMINGU LOOGIKA <========== */
  // stopperikuva:
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

/* ==========> TAIMERI-SPETSIIFILISED MUUNDUJAD <========== */
  // stiliseering viimasele 30 sek-le:
  const isUrgent = timerData?.secondsLeft <= 30 && timerData?.secondsLeft > 0 && !timerData.isPaused;
  const hasEnded = timerData?.secondsLeft === 0 && timerData?.hasStarted;
  //nb! saab ka nendele const-idele juba "sisse ehitada" kontrolli, kas timerData -millest nad sõltuvad -
  // on üldse olemas või on see "null":
  // const isUrgent = timerData && timerData.secondsLeft <= ...... jne
  // EHK "KUI timerData sisu ON olemas, ja need andmed on seisus blablabla, SIIS
  // on sel const-il kirjeldatud väärtus" 

/* NB! natuke react-süntaksit:
{ } - JSX sulud.
  väljumaks/"põgenemaks" html-ist, et kirjutada tagastuslausesse javascripti
  nt: <span>{2 + 2}</span>
  NB! explicit return - pead ise kasutama return-i
() - implicit funktsioonisulud - automaatselt tagastab sulgudes oleva funktsiooni sisu

nuppude loomisel: {timerData?.racers.map((racer) => (funktsioon sulgude sees) } jne ))}
tabelis oli algul: {sortedRacers.map((racer, index) => {funktsioon loogelistes})}
    lahendasin () kasutamisega, aga saanuks ka sisse kirjutada return-lause

` ` - backticks, (ühes ${}-ga )
  kui tarvis kirjutada teksti ning kasutada selle sees muundujaid
  nt: `Time: ${value} seconds`
" " - jutumärgid
  tekstisisuks (plain text) või CSS klasside/markerite jaoks
  nt: <div className="lapDisplay">
  */

/* ==========> REACT (ui loogika, mitte vorming/paigutus/stiilid) <========== */
  return (
    <div className="container">
    {timerData?.sessionStatus === "finished" && (
      <div className="status-bar finished">RACE ENDED - FINAL RESULTS:</div>
    )}
      <h3>{timerData?.hasStarted ? "Race in progress.." : ""}</h3>
      <div className="leaderboard">
        <h2>Current Standings: </h2>
        <table>
          <thead>
            <tr> {
            /*  th - table header
                td - table data
            */}
              <th>Pos</th>
              <th>Driver</th>
              <th>Car</th>
              <th>Lap</th>
              <th>Live</th>
              <th>Latest Lap</th>
              <th>Best Lap</th>
            </tr>
          </thead>
          <tbody>
             {/* viitame ülal määratletud const-ile e sorteeritud sõitjad:*/}
             {sortedRacers.map((racer, index) => {
                let liveLapTime = "--:--:---"; // live-vaateks
                // peame react-sisse looma funktsiooni, et racer-ite
                // andmeid kuvada (scope-teema, mistap ei saa määratleda ülal):
                if (racer.lastLapTimestamp && !racer.isFinished && !timerData?.isPaused) {
                  const elapsed = (now - racer.lastLapTimestamp) / 1000;
                  liveLapTime = formatLapDisplay(elapsed);
                };
                return (
                <tr key={racer.id} className={index === 0 ? "first-place" : ""}>
                  {/* vorming: indeks 0 ehk essa koht saab klassi first-place omadused */}
                  <td>{index + 1}</td> {/* ehk POS on indeksi tõttu nihkes ja vaja paika arvutada */}
                  <td>{racer.name}</td>
                  <td>TBD</td>
                  <td>{racer.lapCount}</td>
                  <td>{liveLapTime}</td> {/* juba "racer." määratletud */}
                  <td>{formatLapDisplay(racer.latestLapTime)}</td>
                  <td>{formatLapDisplay(racer.bestLapTime)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="main-layout">
      <div className="timer-section">
        <div className={`timer-display ${isUrgent ? "danger blink"
          : (hasEnded ? "danger" : "")}`
        }>
          {/* ülal, className-is saab sulgude abil loogika eraldamise asemel
          kasutada ka järjestust (Chains):
          isUrgent ? "danger blink" : hasEnded ? "danger" : ""
          mis toimib TÄPSELT SAMAMOODI kui sulgudega vers, aga on vb inimesele
          kiiresti lugemisel segasem */}
          {timerData
          ? formatTime(timerData.secondsLeft)
          : "Loading..."
          }        
        </div>
        <p>Look at my UI, boy!</p>
        <div className="controls">
        {/* aa , kombineerides loogelised pluss kommentaaritähise
        saab vist React-koodi SISSE ka kommenteerida, vau.
        enivei: järgnev loogeliste sisu tagab selle, et nuppe kuvataks
        ALLES SIIS, kui on ka objektilt saadud andmed olemas */}
          {timerData && (
            <>
             <button onClick={toggleTimer} className={timerData.sessionStatus === "safe"}>
               {timerData?.isPaused
                ? (timerData?.hasStarted ? "Continue" : "Start")
                : "Pause"}
              </button>
              <button onClick={resetTimer} className="end-session-button"><span>Confirm all racers have proceeded to paddock and</span>
              <br></br>
              END RACE SESSION</button>
            </>
          )}
        </div>
      </div>
      {/* loomaks rajanuppe ESIALGU ÜHES ENDA ISIKLIKU AJADISPLEIGA
      saab react-is kasutada map()-i, mis server-info alusel (e meil
      2 sõitjaga objekt) loob iga objekti kohta loendis oma display+nupp
      paari. alustuseks tuleb selleks luua omaette div: */}
      <div className="racers-grid">
        {/* nb! lisa ka vastav klass css-i, ühed display:flex-iga!! */}
        {timerData?.racers.map((racer) => (
          // map-meetod ise kontrollib alguses ?-ga, kas timerData info
          // on olemas - SEE TÄHENDAB, et racer-spetsiifilise info 
          // kontrollimine timerData?-ga ei ole enam vajalik (küll aga
          // jätkuvalt vja kontrollida asju nagu canLap jne, sest on 
          // sõitja-objekti välised muundujad
        <div key={racer.id} className="lap-tracker-ui">

        <button
          onClick={() => socket.emit("record-lap", racer.id)} // peame siin info emit-i välja kirjutama
          //nb! serveris argument "racerId", aga siin map-i kaudu objektist saadud "racer.id"
          /* enne mitmiknupuversiooni oli disabled={!timerData?.canLap} */

          disabled={!timerData?.hasStarted || racer.isFinished}
          className={`lap-button ${!timerData?.hasStarted || racer.isFinished ? "disabled" : "active"}`}>{racer.isFinished ? `${racer.name} FINISHED` : racer.name}
        </button>
      </div>
      ))}
      </div>
      </div>
    </div>
  );
  /*nb! siin osas:
  <div className="timer-display">
        {timerData
        ? formatTime(timerData.secondsLeft) : "Loading..."}
  </div>
  pole tarvidust kirjutada timerDat?.secondsLeft, sest ternary operator
  NIIKUINII juba "teeb ise" selle kontrolli, EHK ET:
    KUI ON timerData olemas, siis tee vorming ja
    KUI EI OLE, siis näita vaiketeksti "Loading.."

  ========
  vana displayloogika, kui nuppude kohal oli veel ajakuva:
  {/* ja vana olemasolev nupuvorming käib nüüd lihtsalt selle grid div
map()-loogika sisse: 
          <div className="lap-display">
            <div className="lap-row">
              Last Lap: <span>{formatLapDisplay(racer.latestLapTime)}</span>
            </div>
            <div className="lap-row-golden">
              Best Lap:<span>
            {racer.bestLapTime // ka siin osuta konkreetsele sõitjale "racer." abil!!!
            ? formatLapDisplay(racer.bestLapTime)
            : formatLapDisplay(racer.latestLapTime)}</span>
          </div>
          </div>
  */
}

/* ==========> REACT-i ULATAMINE MAIN/INDEX.jsx-le ja seega DOM-ile <========== */
export default App;