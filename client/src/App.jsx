// react rendering imports
import { useState, useEffect } from 'react'
// hook centralizing socket.IO and events, related library and events contract
import { socket } from "./socket/socket";
import { useRaceState } from "./hooks/useRaceState.js"
import EVENTS from "./shared/events.js"
// CSS import
import './App.css'

// routing imports
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// user interface imports:
import AuthorizationScreen from "./components/AuthorizationScreen"
import HomePage from "./pages/homePage/HomePage";

import FrontDesk from "./pages/frontDesk/FrontDesk";
import RaceControl from "./pages/raceControl/RaceControl";
import LapTracker from "./pages/lapTracker/LapTracker";
import LeaderboardPage from "./pages/leaderboard/LeaderboardPage";
import NextRace from "./pages/nextRace/NextRace";
import Flags from "./pages/flags/Flags";
import Countdown from "./pages/countdown/Countdown";

import DevPanel from "./dev/DevPanel"

/* authentication prompt */
const AuthGate = ({ children, roleName }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    socket.on(EVENTS.AUTH_RESPONDED, (result) => {
      if (result.success) {
        setIsAuthenticated(true);
        setError("");
      } else {
        setError("Incorrect passcode");
      }
    });

    return () => {
      socket.off(EVENTS.AUTH_RESPONDED);
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    socket.emit(EVENTS.AUTH_ATTEMPT, {
      role: roleName,
      passcode: inputKey
    });
  };
  /* return children if authorized */
  if (isAuthenticated) {
    return children;
  }

  // Authorization view
  return (<AuthorizationScreen
    roleName={roleName}
    handleLogin={handleLogin}
    inputKey={inputKey}
    setInputKey={setInputKey}
    error={error}
  />);
};

// Placeholder for missing content (mainly used for dev purposes)
const Placeholder = ({ ajutine }) => (
  <div style={{ padding: "20px" }}>
    <h2>{ajutine} Leht</h2>
    <p>Page under construction</p>
    <Link to="/">Returh to main page</Link>
  </div>
);

function App() {
  const listenSocket = useRaceState((state) => state.listenSocket);

  useEffect(() => {
    listenSocket();
  }, []);

  {/*RETURNING CONTENT VIA ROUTING*/
    /* note - all planned content provided through explicit routes */
  }
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* ROOT DIR*/}
          <Route path="/" element={<HomePage />} />

          {/* FRONT DESK*/}
          <Route path="/front-desk" element={
            <AuthGate roleName="Receptionist">
              <FrontDesk />
            </AuthGate>} />

          {/* RACE CONTROL */}
          <Route path="/race-control" element={
            <AuthGate roleName="Safety Official">
              <RaceControl />
            </AuthGate>} />

          {/* LAP TRACKER */}
          <Route path="/lap-line-tracker" element={
            <AuthGate roleName="Lap Observer">
              <LapTracker />
            </AuthGate>} />

          {/* PUBLIC SCREENS */}

          <Route path="/leader-board" element=
            {<LeaderboardPage />} />
          <Route path="/next-race" element=
            {<NextRace />} />
          <Route path="/race-flags" element=
            {<Flags />} />
          <Route path="/race-countdown" element=
            {<Countdown />} />

        </Routes>
      </BrowserRouter>

      {import.meta.env.DEV && <DevPanel />}
    </>
  );
}

export default App;
