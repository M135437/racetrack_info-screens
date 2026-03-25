/* geminiga koos timestamp-timer, aga NULLIST reacti-ga tegemist arvesse võttes:
kõigepealt host-server, mis originaalile üsna sarnane */

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "http://localhost:5173" }
}); // kogu react/css/html on siin aadressil

const isDev = process.env.NODE_ENV === "development";
const timerDuration = isDev ? 60000 : 600000;

let endTime = Date.now() + timerDuration;
let isPaused = true;
let hasStarted = false; // continue/start kombonupuks lisan staatuse
let pausedTimeRemaining = timerDuration; /* et "päris"
pausi teha, peab nupule andma võimekuse talletada
pausi-vajutamise hetkel olnud
timestamp, mis võimaldaks arvutada, kui palju aega
"olnuks määratud date-now+duration lõpuni" */

/* NB!
hasStarted flag-i asemel siin ja jsx-is  saab ka muuta *ainult serveri loogikat*:

socket.on("toggle-timer", () => {
    // kontrollime, kas 2 aega kattuvad:
    const isBrandNew = (pausedTimeRemaining === timeruration)

    if (isPaused) {
        endTime = Date-now() + pausedTimeRemaining;
        isPaused = false;
    } else {
        pausedTimeRemaining = Math.max(0, endTime - Date.now());
        isPaused; true;    
    }
    
    io.emit("state-update", { endTime, isPaused, pausedTimeRemaining });
});

misjärel .jsx-is on nupuloogika natuke flag-versioonist erinev:

    <button onClick={() => socket.emit("toggle-timer")}>
        {isPaused
            ? (pausedTimeRemaining < timerDuration ? "Continue" : "Start")
            : "Pause"
        }
    </button>

selline lähenemine on hea serverimälu säästja, kuid suures süsteemis
vähem robustne
*/

// lihtsalt teabeks terminalis:
console.log(`Running in ${isDev ? "DEV" : "PRODUCTION"} mode.`);
console.log(`Timer set to: ${timerDuration / 1000} seconds.`);

// esmavers. puudub state-requesti "kuulamine";
// vaid vaikimis ühendusel uuenduse saatmine
io.on("connection", (socket) => {
    socket.emit("state-update", { endTime, isPaused, pausedTimeRemaining, hasStarted });

    socket.on("toggle-timer", () => {
        if (!hasStarted) { // kui pole taimerit käivitatud,
            hasStarted = true; // siis klikkamisel staatus "on küll käivitatud",
            // kuni reset-ini (mil sunnime hasStarted = false)
        }
        if (isPaused) {
            // JÄTKAMISE-LOOGIKA:
            // deklareerime *uue* endTime-i väärtuse hetke-aja alusel + mis oli siis jääk:
            endTime = Date.now() + pausedTimeRemaining;
            isPaused = false; // enam pole pausis (liigub uue arvutuse alusel edasi)
        // NB! kuna lisasime pausiaja muunduja, siis server saab
        // isPaused=false abil tagada taimeri manuaalse käivituse
        // (enne nö "tiksus taustal" lehe külastamisest alates aeg, mida enam uuesti
        // algusesse ei saanud ilma serveri-resetita)
        } else {
            // PAUSIPANEMISE-LOOGIKA:
            pausedTimeRemaining = Math.max(0, endTime - Date.now());
            isPaused = true; // seame pausile
        }
        io.emit("state-update", { endTime, isPaused, pausedTimeRemaining, hasStarted });

    });
    socket.on("reset-timer", () => {
        isPaused = true;
        hasStarted = false; // nö puhastame ajaloo
        pausedTimeRemaining = timerDuration; // reset-ime 10/1 min peale tagasi
        // st kui state on pausedTime, siis sunnime ta olema timerDur,
        // mille ALGNE let väärtus oli millisekundite-jant
        endTime = Date.now() + timerDuration;

        // tedaanne uuest algpunktist
        io.emit("state-update", { endTime, isPaused, pausedTimeRemaining, hasStarted });
    });
});

httpServer.listen(3001, () => {
    console.log("Server logic running on http://localhost:3001");
}); // host-serveri andmeloogika ise siin aadressil

// __dir pole enam tarvilik, sest server ei "serveeri" enam faile