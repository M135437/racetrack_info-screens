
import { useState } from 'react'
import './App.css'

// npm install react-router-dom (client-kaustas)
/* nb! kuna meil on (minu pärast) vana vite, siis installimisel toob
esile vite-i 1 high-risk murekoha. 
gemini sõnul see vaid murekoht arenduse ajal serveripoolel (kui häkker samas
võrgus tahaks salafailidele ligi pääseda, siis potentsiaalselt saaks), kuid
mis ei kandu lõpptootesse üle.

npm audit fix uuendaks vite-i, aga kuna mul juust arvuti, siis pliis
ärme vaheta vite versiooni :D
*/

// vajalikud impordid jaotusfunktsionaalsuseks:
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// ui-impordid:
import HomePage from "./pages/homePage/HomePage";

import FrontDesk from "./pages/frontDesk/FrontDesk";
//import RaceControl from "./pages/raceControl/RaceControl";
import LapTracker from "./pages/lapTracker/LapTracker";
import LeaderboardPage from "./pages/leaderboard/LeaderboardPage";
import NextRace from "./pages/nextRace/NextRace";
import Flags from "./pages/flags/Flags";

//import FrontDesk from "./pages/frontDesk/FrontDesk";
//import RaceControl from "./pages/raceControl/RaceControl";
//import LapTracker from "./pages/lapTracker/LapTracker";

//import Countdown from "./pages/countdown/Countdown";

/* ajutine autentimiskuva (hiljem eraldi komponendiks?) 
ühtlasi - sõnastus hiljem kohaldada vastaval auth.js sisule */
const AuthGate = ({ children, roleName }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");

  // nb! "children" on kindel sõnavara (reserved keyword) !!!
  // siin loodud AuthGate funktsioon kasutab "children", et 
  // KÕIKI tema sees määratletud osi kokku grupeerida ->
  // loob ümbrise, mis aitab vältida koodi taaskirjutamist (DRY-põhimõte),
  // sest loogika (tagasta "lapsed" kehtib igale elemendile, millega
  // ta on ümbritsetud ja ei pea igale mõjutamist vajale elemendile
  // hakkama looma oma eraldi loogikat)

  const handleLogin = (e) => {
    e.preventDefault();
    // siia peaks käima socket-infovahetus parooli kontrollimiseks,
    // aga testimiseks hardcodein "0000":
    if (inputKey === "0000") {
      setIsAuthenticated(true);
    } else {
      setError("Vale parool - proovi uuesti! (testkood on 0000)");
      // hetkel läägi ei pane, see vist peaks ka auth-loogikast tulema?
    }
  };
  if (isAuthenticated) { // kui autentimine õnnestus, siis
    return children; // UI sisu kuvamine
  }

  // pääsukuva:
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>{roleName} - authorised access only!</h2>
      <p>Please provide passcode:</p>
      <form onSubmit={handleLogin}>
        <input
        type="password"
        value={inputKey}
        onChange={(e) => setInputKey(e.target.value)}
        />
        <button type="submit">Enter</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Link to="/">Home</Link>
    </div>
  );
};

// funktsionaalsuse tekstimiseks minikuva, sest muidu react jookseb kokku,
// kui komponente veel pole:
const Placeholder = ({ ajutine }) => (
  <div style={{ padding: "20px"}}>
    <h2>{ajutine} Leht</h2>
    <p>Lehekülg on arendamisel</p>
    <Link to="/">Mine tagasi esilehele</Link>
  </div>
);

function App() {
  return (
    <BrowserRouter> {/* kogu return peab olema mähitud jagajasse */}
    {/* kõik, mis jääb VÄLJAPOOLE <routes>i, on püsivalt brauseri lehel */}
      <Routes>
        {/* siin osas defineerime kõik route-id: */}
  
        {/* "koduleht" ka*/}
        <Route path="/" element={<HomePage/>}/>

        {/* -> ajutine route-ing <- 
        
        parooli vajavad UI-d saavad AuthGate-ga mässitud: */}
        <Route path="/front-desk" element={
          <AuthGate roleName="Receptionist">
           {/* <Placeholder ajutine="FrontDesk"/> */}
            <FrontDesk/>
          </AuthGate>}/>
          
        <Route path="/race-control" element={
          <AuthGate roleName="Safety Official">
            <Placeholder ajutine="RaceControl"/>
          </AuthGate>}/> {/*
        <Route path="/lap-line-tracker" element={
          <AuthGate roleName="Lap Observer">
            <Placeholder ajutine="LapTracker"/>
          </AuthGate>}/> */}
         

          {/* 🔥 HEILIKA PUBLIC SCREENS */}

        <Route path="/leader-board" element=
        {<LeaderboardPage />}/>
        <Route path="/next-race" element=
        {<NextRace />} />
        <Route path="/race-flags" element=
        {<Flags/>}/>

        {/* Muud arenduses olevad vaated */}
        <Route path="/race-countdown" element={<Placeholder ajutine="Countdown"/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
