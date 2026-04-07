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
//import FrontDesk from "./pages/frontDesk/FrontDesk";
//import RaceControl from "./pages/raceControl/RaceControl";
//import LapTracker from "./pages/lapTracker/LapTracker";
//import LeaderboardPage from "./pages/leaderboard/LeaderboardPage";
//import NextRace from "./pages/nextRace/NextRace";
//import Countdown from "./pages/countdown/Countdown";
//import Flags from "./pages/flags/Flags";

// funktsionaalsuse tekstimiseks minikuva, sest muidu react jookseb kokku,
// kui komponente veel pole:
const Placeholder = ({ ajutine }) => (
  <div style={{ padding: "20px"}}>
    <h2>{ajutine} Leht</h2>
    <p>Testleht - Homepage-lehekülg on arendamisel</p>
    <Link to="/">Tagasi</Link>
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

        {/* ajutine route-ing: */}
        <Route path="/front-desk" element={<Placeholder ajutine="FrontDesk"/>}/>
        <Route path="/race-control" element={<Placeholder ajutine="RaceControl"/>}/>
        <Route path="/lap-line-tracker" element={<Placeholder ajutine="LapTracker"/>}/>
        <Route path="/leader-board" element={<Placeholder ajutine="LeaderboardPage"/>}/>
        <Route path="/next-race" element={<Placeholder ajutine="NextRace"/>}/>
        <Route path="/race-countdown" element={<Placeholder ajutine="Countdown"/>}/>
        <Route path="/race-flags" element={<Placeholder ajutine="Flags"/>}/>

        {/* päris-routing:
        <Route path="/front-desk" element={<FrontDesk/>}/>
        <Route path="/race-control" element={<RaceControl/>}/>
        <Route path="/lap-line-tracker" element={<LapTracker/>}/>
        <Route path="/leader-board" element={<LeaderboardPage/>}/>
        <Route path="/next-race" element={<NextRace/>}/>
        <Route path="/race-countdown" element={<Countdown/>}/>
        <Route path="/race-flags" element={<Flags/>}/>
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App
