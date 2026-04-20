import { useRaceState } from "../../hooks/useRaceState.js"
import { socket } from "../../socket/socket";
import EVENTS from "../../shared/events";
import { PROTECTED_MODES, RACE_MODES, END_MODE } from "../../shared/types";

// CSS
import "../../App.css"

// Components
import PageHeader from "../../components/PageHeader.jsx"
import Timer from "../../components/Timer.jsx"
import ControlButton from "../../components/ControlButton.jsx"
import NoSessionsState from "../../components/NoSessionsState.jsx";
import ReturnToPaddock from "../../components/ReturnToPaddock.jsx"
import { useEffect } from "react";
import SessionListing from "../../components/SessionListing.jsx";

const element = 'RACE CONTROL'

function RaceControl() {
    console.log("socket connected at RaceControl:", socket.connected);

    const sessions = useRaceState(state => state.sessions);
    console.log("Client(RaceControl.jsx): siin trükin racekontrolis ja sessions on: ", sessions)
    const nextSession = sessions.find((session) => session.status === 'notStarted');
    console.log("siin trükin juba nextSession: ", nextSession)
    const raceMode = useRaceState((state) => state.raceMode);
    const runningRace = useRaceState((state) => state.runningRace)
    const listenSocket = useRaceState((state) => state.listenSocket);

    useEffect(() => {
        if(listenSocket) {listenSocket();}
    }, [listenSocket]);

    // button onClick functions
    const emitStart = () => {
        socket.emit(EVENTS.SESSION_START);
        };
    const emitSafe = () => {
        socket.emit(EVENTS.SESSION_MODE, PROTECTED_MODES.SAFE)
        };
    const emitDanger = () => {
        socket.emit(EVENTS.SESSION_MODE, PROTECTED_MODES.DANGER);
        };
    const emitHazard = () => {
        socket.emit(EVENTS.SESSION_MODE, PROTECTED_MODES.HAZARD);
        };
    const emitFinishing = () => {
        socket.emit(EVENTS.SESSION_FINISH);
        };
    const emitEnd = () => {
        socket.emit(EVENTS.SESSION_END);
        };

    const displayView = (() => {
        if (!(nextSession) && !(runningRace)) return "waitingForSession";
        if (nextSession && !(runningRace)) return "startingSession";
        if (runningRace && !(raceMode === PROTECTED_MODES.FINISH)) return "duringRace";
        if (raceMode === PROTECTED_MODES.FINISH) return "returningToPaddock";
        return "waitingForSession";
            })();

    return <div >
        <div className="container">
            <div className="control-header">
                <PageHeader title={element}/>
            </div>
        </div>
        <div className="card">

        {displayView === "waitingForSession" && <NoSessionsState />}

        {displayView === "startingSession" && (
            <>
        
            <div className="card">
                <p className="card_content">Next Race:</p>
                <SessionListing nextSession={nextSession}/>

            </div>
        <div className="racestart-btn">
        <ControlButton buttonName={"start".toUpperCase()} onClick={emitStart}/>
        </div>
        </>
        )}

        {displayView === "duringRace" && (
            
            <div className="racemode-btn-container">
                <Timer />
                <div className="racemode-grid">
                <ControlButton buttonName={PROTECTED_MODES.SAFE.toUpperCase()} onClick={emitSafe}/>
                <ControlButton buttonName={PROTECTED_MODES.DANGER.toUpperCase()} onClick={emitDanger}/>
                <ControlButton buttonName={PROTECTED_MODES.HAZARD.toUpperCase()} onClick={emitHazard}/>
                <ControlButton buttonName={PROTECTED_MODES.FINISH.toUpperCase()} onClick={emitFinishing}/>
                </div>
            </div>
        )}

        {displayView === "returningToPaddock" && (
            <>
                <Timer />
                <ReturnToPaddock />
            <div className="raceend-btn">
                <ControlButton buttonName={END_MODE.END.toUpperCase()} onClick={emitEnd}/>
            </div>
            </>
        )}
        </div>
    </div>

}

export default RaceControl;