// AJUTINE; kiirel pilguviskel ei näinud, kelle pärusmaaks see jäeti.
// aga ilma selleta mu laptracker ei tööta

/* HOOK on vahend, mille abil ükskõik, mis osa süsteemist pääseb
komponendile ligi.

hook teeb samaaegselt 2 asja:
- edastab serverist tuleva "tõe" - iga 1s tagant taimer
- loob kliendiserveri tarbeks lokaalse arvestusega visuaalid
(eelnevalt oli mul server.js-is timer-tick ning app.jsx-is
const ticker)

ühtlasi teeb cleanupi NII taimeri kui visuaali jaoks - socket.odd
sulgeb "kõrva" taimeri kuulamisega ning clearInterval tegeleb
visuaaliarvutuse kustutamisega (eelnevalt oli
mul mõlema jaoks eraldi cleanup)

*/

// IMPORDID:
import { useState, useEffect } from "react"; // react-tööriistad:
// useState - mälu
// useEffect - haldur - funktsiooni ühekordne käivitus. käivita socket,
// kui rakendus esmakordselt käivitub; sulge socket, kui kasutaja
// lahkub lehelt
// "from react" - hook on seotud react-i omadustega (lehe üle ja üle
// render-imine/uuendamine), mistõttu peab olema selle läbi talle
// ka react-teemalised tööriistad imporditud 
// NB! hook-i nimi PEAB algama sõnaga "use"!! (et süsteem näeks ja 
// kohtleks seda faili react-loogika osana!)
import { socket } from "../socket/socket"; // serveri info

export const useRaceState = () => {
    const [timerData, setTimerData] = useState(null);
  // KUI DEFINEERIME ILMA VÄÄRTUSETA OBJEKTI, SIIS PEAME return-IS KASUTAMA
  // "?" EHK "Optional Chaning". see tähendab, et JUHUL KUI objektil ON
  // väärtus, toimub kirjeldatud funktsioon (ei crashi puudulike andmete puhul)
  // süsteemi laienemisel väidetavalt hea lähenemine, sest objektile saab
  // lihtsalt omadusi/staatuseid juurde lisada ning neile kõigile pääseb
  // React-poolses koodis mugavalt ligi, lisamata uusi useState-isid

  // leaderboardi current lap millisekundi visuaali tarbeks:
    const [now, setNow] = useState(Date.now());

/* ==========> heartbeat ja lokaalsed visuaalid  <========== */  
    useEffect(() => {
        socket.on("timer-tick", (data) => {
            // testimiseks kuvame sõitjate andmeid:
            console.log("current race state: ", data.racers);
            setTimerData(data);
        });

        // kliendipoolele visuaaliks kiirtaimeri visuaal:
        const ticker = setInterval(() => {
            setNow(Date.now());
        }, 50); // e 50ms takka uuenev ajakuva (kui seda leaderboardil tahame)

        // cleanup mõlemale:
        return () => {
            socket.off("timer-tick");
            clearInterval(ticker);
        };
    }, []);

    // andmete tagastamine süsteemile kasutamiseks
    return { timerData, now };
};