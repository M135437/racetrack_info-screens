/* HEARTBEAT, kus iga progeja poolt sätestatud ajahulga tagant
saadab server kliendile mingit infot
sobib selliste andmete edastamiseks, mille uuenemine ei
ole ülitähtis, nt ilmaäpi ilmateade, võrguühenduse "ping" jne

taimeri puhul võrguühenduse "hakkimisel" tekib paus ja uus info "hüppab" -> 1..2../tõrge/..5..
(timestamp-tüüp oma Maths-arvutustega tagab sujuva andmete muutumise
-> 1..2../tõrke ajal jätkub:/..3..4..5 jne)
*/

// minimuutus et pushida prototüübi esmavers eraldi oksale hilisemaks kopipeistiks
/* ==========> IMPORDID (express, socket) <========== */
import express from "express";
import { createServer } from "http"; // et express ja socket koos töötaksid
import { Server } from "socket.io";

// testpush uuel oksal

/* ==========> SERVERIÜHENDUS, handshake, CLIENT-i PORT <========== */
const app = express(); // info "vahendaja"
const httpServer = createServer(app); // infovahenduskeskkond
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"] // ???? okei...
    /* uurisin üle, et kuigi socket-io vaikimisi tagab baas api-meetodid handshake-il
    , siis brauserite turvasätete erinevuse tõttu võib esineda viperusi, kui pole
    ise serveris spetsiifiliselt ära määranud, mis õigused kahel pordil
    omavahel suhtlemiseks on. */
    }
}); // suhtluskanal andmete vahendamiseks

/* ==========> DEV vs PROD KESKKOND KÄIVITUSEL <========== */
const isDev = process.env.NODE_ENV === "development";
const timerDuration = isDev ? 60 : 600; // sekundites
// 1min = 60 sek, seega 10min on 60x10=600
// server hakkab määratud arvust allapoole lugema

//NB! kui tahame TAIMERILE ka millisekundeid külge, siis see
// mõistlik lahendada kliendipoolselt.

let secondsLeft = timerDuration;

// enda kontrollimiseks konsoolile:
console.log(`Mode:${isDev ? "DEVELOPMENT" : "PRODUCTION"}`);
console.log(`Starting timer at: ${secondsLeft} seconds`);

/* ==========> MUUNDUJAD (jsx-is timerData sisu) <========== */
// kuna tahan lisada juurde toggle-nupu, mis pausitaks/jätkaks taimerit:
let isPaused = true; // vaikeväärtus, seega leht laeb pausis-olekus, et kasutaja saaks ise panna "start"
let hasStarted = false; // määraatlemaks, kas taimeriga on tehtud esmakäivitus
// (et saaksin nupul teksti Start asemel kasutada hiljem Continue)

/* STOPPERIVÕIMEKUSE LISAMINE:
kasutan meie ralliäpiks loogilisi nimetusi; nkn läheks vaja*/
let raceStartTime = null; //hasStarted-iga algab stopperi ajaarvestus
// racer-spetsiifiline ja nüüd objektis olemas:
// let lastLapTimestamp = null; // hakkame serveris ajahetke abil arvutama
let latestLapTime = null; // kuvatav tulemus (hiljem püüan lisada kiireimaga, aga kõigepealt tahaks toimima saada)
let bestLapTime = null;
let finalLapDone = false; // et keelata ajavõtunupu kasutus pärast taimeri nulli jooksmist ja sellejärgset viimast salvestamist

/* KUI NÜÜD TAHTA LISADA RAJANUPPE STOPPERILE JUURDE,
siis peab hakkama kasutama objektiloendit (Array of Objects), kus
id alusel annad igale objektile omadused - kõik rajaajainfod - ning
edastad need ka emitState() sees ja emit-is:
*/

// alustan sellega, et määran ise nt 2tk (hiljem uurin, kuidas
// sisse viia see max 8tk loogika, mis on frontdesk pärusmaa, aga küllap
// arrayle max pikkus ja sisu ise on add-funktsioon ja mingisugune set() vms)
let racers = [ 
{id: 1, name: "racer 1", latestLapTime: null, bestLapTime: null, lastLapTimestamp: null, isFinished: false},
{id: 2, name: "racer 2", latestLapTime: null, bestLapTime: null, lastLapTimestamp: null, isFinished: false}
];
/* kui tahan hiljem id-ga otsida, SIIS PEAN MEELES PIDAMA, ET LOENDI
INDEKSEERIMINE ALGAB 0-GA ja seega peaks ka indeksid olema 0,1 ...
kui aga soovin ise id-sid (nt auto-gen), siis tuleb leidmisel kasutada find() */

// et server saaks aru, millised rajanupud on missuguse objektiga seotud, tuleb
// edastada objektide id-d socket-emiti (record-lap) argumendina!

/* ==========> STATE-i EDASTAMINE <========== */
/* deklareerime tõhusamaks state-objekti jagamiseks tema väärtuse
(e sisu) abimeetodiga: */
const emitState = () => { /* tulevikus sarnane asi sisaldaks siis
 sessiooni ID-d, temaga seotud nimesid/sõitjaid ja sõidustaatust (safe, hazard..) jne */
    io.emit("timer-tick", {
        secondsLeft,
        isPaused,
        hasStarted,
        latestLapTime,
        bestLapTime,
        finalLapDone,
        // canLap ütleb UI-le, kas stopperinupp on vajutatav;
        // nb! igale sõitjale pean looma canLap-iga seotud eraldiseisva
        // isFinished (vms) infoga muunduja!:
        // pre-mitmiknupp:
        // canLap: hasStarted && (secondsLeft > 0 || !finalLapDone),
        // PEAB olema alanud-faasis ja KAS üle 0sek VÕI pole viimast ringi tehtud
        // 0-erandi määratleme hiljem, allpool
        racers // kogu loendi sisu
    });
};

/* ==========> COUNTDOWN (heartbeat taimer) <========== */
setInterval(() => {
    // loendamine toimub vaid siis, kui tõene on nii hasStarted ja väär on isPaused:
    if (hasStarted && !isPaused && secondsLeft > 0) {
        secondsLeft--;
        emitState();
        /* enne emitState helperit oli:
        io.emit("timer-tick", { secondsLeft, isPaused, hasStarted });
        */
        }
    }, 1000);
    // kui timestamp-is oli 1000 selleks, et teha ms-idest sekundeid,
    // siis pulseerimismeetodil on MILLISEKUNDID SEE ÜHIK, MILLE TAGANT
    // INFOT VÄLJASTATAKSE (nt meil ülesandes passowrd-fail 500ms paus jne)
    // kuna meil ülesandes vaja, et uus kellaaeg tuleks IGA SEKUNDI TAGANT,
    // siis intervall on 1 sekund ehk 1000 millisekundit, seega
    // -> 1000

// antud juhul vb vähem oluline, sest iga sekund muutus (nii et kui
// lisataksi me pärisülesande puhul nt kuskil ekraan juurde hiljem, siis on
// see üsna ruttu up-to-date), AGA
// kui pikemad intervallid, siis järgnev edastab uuele liitujale
// uusimad andmed

/* ==========> NUPPUDE MÕJU SERVERIÜHENDUSEL <========== */
io.on("connection", (socket) => { // socket, sest
    // teistel (io) pole sama inffi uuesti vaja
    emitState(); // jällegi helperiga kogu objekti emit

/* =========> TAIMER SEES/JÄTKAB/PAUS NUPP <========== */
    socket.on("toggle-timer", () => { // kui klikatakse toggle-nuppu
        if (!hasStarted) {
            hasStarted = true; // siis onAlanud = tõene
            // taimeri käivitusega algab stopperiaja arvutusandmete kogumine:
            const now = Date.now();
            raceStartTime = now; // kuna taimerit saab pausitada ja salvestada saab aegu
            // ka 00:00 järgselt (finish-mode loogika), siis samal hetkel algab nii
            // võistluse alguse markeerimine (eraldi taimerist)
            // kui ka ringiaegade avestuse algus)
            finalLapDone = false; // (selle muudame tõeseks alles siis, kui taimer on nullis)

            //igal sõitjal oma isikliku algusaja sättimine taimeri käivituse hetkel:
            racers.forEach(r => {
                r.lastLapTimestamp = now;
            });
        }
        isPaused = !isPaused; 
        emitState();
}); 

/* ==========> STOPPERI JOONEÜLETUSNUPP <========== */
    socket.on("record-lap", (racerId) => { // objekti id on argumendiks!
        // nüüd, kus iga nupp seotud konkreetse objekti (sõitjaga),
        // peab muundujatele ette lisama spetsifikatsioonina "racer."
        // ehk selle loendi nime, mille sees see objekt ühes oma
        //omadustega on (või võin ka const-id ette luua, et sisu lihtsustada,
        //, aga point jääb - peab olema viidatud)

        // konkreetse sõitja info saamine find()-ga:
        const racer = racers.find(r => r.id === racerId);
        // kui tahta leida otse id-alusel (nb!indeksid!!), siis:
        // const racer = racers[racerId];

        // errori/puuduliku info käsitlus ja ringiaja salvestamise
        // õiguse valideerimine:
        if (!racer || racer.isFinished || !hasStarted) {
            return;
        } // (varasemalt ühenupuvers - hasstarted ja finallap (canlap)
        // piisav nupulukuks post-timer. seega nüüd vaja siduda iga
        // sõitjaga, et ühe sõitja finallap ei lukustaks KÕIKIDE lap-nuppe)

        // joonenupp pole lubatud, kui pole sõit alanud v juba viimane ring sooritatud
        if (secondsLeft <= 0) {
            racer.isFinished = true;
            // kui on sekundid nullis ja vajutatakse nuppu,
            // siis seejärel saab isFinished tõese väärtuse
        }
        
        const now = Date.now(); // esmane nupuvajutus võtab algpunkti

        // konkreetse sõitja algusaja/ületusaja defineerimine:
        const startTime = racer.lastLapTimestamp || raceStartTime;
        const elapsed = (now - startTime) / 1000; // aja arvutuskäik
        
        racer.latestLapTime = elapsed.toFixed(3); // 3 komakohta millisekundeid DISPLEI-VERSIOON!!
        
        // konkreetse sõitja parima aja arvestus:
        const currentLap = parseFloat(racer.latestLapTime); // stringist saadud ARV
        /* ja loome loogika parimaks ajaks LIHTSAMAL MOEL ehk
        kõrvutades kaks aega ja jättes alles AINULT parima: */
        if (racer.bestLapTime === null || currentLap < racer.bestLapTime) {
            racer.bestLapTime = currentLap;
        }

        racer.lastLapTimestamp = now; // nupuvajutusel uue ajaarvamise alguse määramine

        emitState();

        /* ajaloo salvestamisega keerukam versioon, mis hõlmab array-de kasutust:
        let allLaps = []; <- tühi loend
        
        socket.on("record-lap", () => {
            // arvutuskäik
            allLaps.push(parseFloat(elapsed.toFixed(3))); // ja loendisse lisamine
            
            // parima arvutamine:
            const bestLapTime = Math.min(...allLaps);
            emitState();
        });
           
        saab minna ka veel põhjalikumaks, lisades loodava ringiajaloo muunduja loendi
        ka otse edastatavasse staatuse-objekti. võimaldaks kuvada nii viimast aega
        kui ka parimat
        */
    });
/* ==========> TAIMERI RESET-NUPP <========== */
    socket.on("reset-timer", () => { // kui vajutada reset-nuppu
        isPaused = true; // saab staatuse onPausil
        hasStarted = false; // kaotab staatuse onAlanud (käivitatud)
        secondsLeft = timerDuration; // vastavalt dev v prod-build asendatakse taimeril seni olnu vaikeseadeks (60 v 600)
        // reset-iga "kustutame" senised raja-aja andmed:
        latestLapTime = null;
        // lastLapTimestamp = null;
        bestLapTime = null;
        finalLapDone = false;
        raceStartTime = null;

        //reset-iga tühjendame ka sõitjate isikliku ajaloo:
        racers.forEach(racer => {
            racer.latestLapTime = null;
            racer.bestLapTime = null;
            racer.lastLapTimestamp = null;
            racer.isFinished = false;
        });
        // (et rajaloendi kuva oleks vastav ja ei näitaks eelmise sõidu aega)
        // taaskord kuulutatakse staatusemuutust üle süsteemi:
        emitState();
    });
});

/* ==========> SERVERIÜHENDUS KLIENTI "KUULAMAKS", HOST-i PORT <========== */
// server peab ka kliendipoolset sisendit "kuulama"
httpServer.listen(3000, () => {
    console.log("Server logic running on http://localhost:3000");
});

/*
loogika asukoht: SERVER kalkuleerib aja
vorming: pakitud iga "pulseerimise" ümber
võrk: lakkamatu "pläkutamine" (chatter); 1msg/sec

vs timestamp, kus:
loogika asukoht: KLIENT kalkuleerib aja (polling-adjacent)
vorming: 60xsekundis (iga kaader/frame)
võrk: ühekordne kutsung alguses, seejärel vaikimisi jätk
      vaid info/andmete muutumisel
*/