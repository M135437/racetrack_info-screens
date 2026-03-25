import bgImage from "./assets/bg.png";

import { useState, useEffect, useRef } from 'react'
/* useState - "mäletamaks" staatuseid (aja jääk taimeril)
useEffect - 
useRef - 
*/

import { io } from "socket.io-client";
import './App.css'

/* logod kind of suva, a vb viisakusest peaks jätma
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
tuleks ise kuhugi body-sse lisada ka, et ka näha oleks
*/

// enne äpifunktsiooni (süda, kinda) veel helperid e
// sama mata, mis oli ennem utils.js-is:
const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// ühandus serveriga:
const socket = io("http://localhost:3001");

function App() {

  // react-i staatuste kasutamine (äpi "mälu"):
  const [endTime, setEndTime] = useState(0); // mis millisekundi peal on lõpp
  const [isPaused, setIsPaused] = useState(true); // kas taimer on peatatud v liigub
  const [timeLeft, setTimeLeft] = useState(0); // kuvatav aeg
  const [pausedTimeRemaining, setPausedTimeRemaining] = useState(0); // pausijääk
  const [hasStarted, setHasStarted] = useState(false);

  // "pistikuga" (socket) ühendumisel:
  useEffect(() => {
    socket.on("state-update", (data) => {
      setEndTime(data.endTime);
      setIsPaused(data.isPaused);
      setPausedTimeRemaining(data.pausedTimeRemaining); // "pargitud" aeg
      setHasStarted(data.hasStarted);
    });
    return () => socket.off("state-update");
  }, []);

  // taimeri numbrivahetuse animatsioon:
  useEffect(() => {
    let frameId;

    const runAnimationLoop = () => {
      if (isPaused) {
        setTimeLeft(pausedTimeRemaining); // paus-staatuses salvestub pausi-hetke aeg
      } else {
        const now = Date.now();
        const difference = Math.max(0, endTime - now);
        setTimeLeft(difference);
      }
      frameId = requestAnimationFrame(runAnimationLoop);
    };
    frameId = requestAnimationFrame(runAnimationLoop);
    return () => cancelAnimationFrame(frameId);
    // kasutatud frame-i kustutamine vältimaks mälulekkeid. pmst clear cache?
  }, [endTime, isPaused, pausedTimeRemaining]); // dependency-array

  // stiliseeritud viimased 30sek:
  const isUrgent = timeLeft <= 30999 && timeLeft > 0 && !isPaused;
  const hasEnded = timeLeft === 0 && !isPaused;
  // siit juba React-spetsiifiline süntaks, mis veitsa võõras veel.
  // React-vormingut return-itakse:
  return (
    <div className="container" style={{ backgroundImage: `url(${bgImage})` }}>
      <h1>Timestamp-timer</h1>
      <h2>React-driven version!</h2>
      <div className={`timer-display ${isUrgent ? "danger blink"
        : (hasEnded ? "danger" : "")}`}>
        {formatTime(timeLeft)}
        {isPaused && <span style={{ fontSize: "1rem", display: "block" }}>(paused)</span>}
      </div>

      <p>Look at my countdown, boy!</p>
      <p>(again!!)</p>
      <div className="button-group">
        <button onClick={() => socket.emit("toggle-timer")}>
          {isPaused
          ? (hasStarted ? "Continue" : "Start")
        : "Pause"}
        </button>
        <button className="btn-reset" onClick={() => socket.emit("reset-timer")}>
          Reset timer
        </button>
      </div>
    </div>
  // react-iga väheneb HTML-ist elementide "üles otsimine", sest
  // muutused käivad käsikäes andmemuutustega
  // pole vaja nt document.getElementById() jne
  );
} // app function lõpp

// sisu exportimine, et muu süsteem saaks siin olevat loogikat kasutada:
export default App

/* kui soov <body> sees teha muudatusi (nt äpi sees eri lehtedel totaalselt erinev taustapilt vms),
siis kasutatakse "Side Effect"-i:

  useEffect(() => {
    document.body.style.backgroundImage = "url('kohalik assets-ist või ka veebiurl')";
    document.body.style.backgroundSize = "cover";
    
    return () => { // alati peab olema "cleanup" mälulekete vältimiseks
      document.body.style.backgroundImage = "";
      };
      }, []);
      */
