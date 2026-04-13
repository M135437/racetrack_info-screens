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
import ListOfSessions from "../../components/ListOfSessions.jsx"

const element = 'RACE CONTROL'

function RaceControl() {
    const sessions = useRaceState((state) => state.sessions);
    console.log("socket connected:", socket.connected);
    // button onClick functions
    const emitStart = () => {
        socket.emit(EVENTS.SESSION_START);
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

    return <div >
        <div className="container">
        <PageHeader title={element} />
        </div>
        <div className="card">
        <Timer />
        <ListOfSessions sessions={sessions}/>
        <ControlButton buttonName={PROTECTED_MODES.SAFE.toUpperCase()} onClick={emitStart}/>
        <ControlButton buttonName={PROTECTED_MODES.DANGER.toUpperCase()} onClick={emitDanger}/>
        <ControlButton buttonName={PROTECTED_MODES.HAZARD.toUpperCase()} onClick={emitHazard}/>
        <ControlButton buttonName={PROTECTED_MODES.FINISH.toUpperCase()} onClick={emitFinishing}/>
        <ControlButton buttonName={END_MODE.END.toUpperCase()} onClick={emitEnd}/>
        </div>
    </div>

}

export default RaceControl;