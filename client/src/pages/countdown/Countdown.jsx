import { useEffect, useState } from "react";
import "./Countdown.css";
import { socket } from "../../socket/socket";
import EVENTS from "../../shared/events";
import { RACE_MODES } from "../../shared/types";
import Timer from "../../components/Timer";

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState(null);
    const [raceMode, setRaceMode] = useState(RACE_MODES.NOTSTARTED);

    useEffect(() => {
        // Kuulame taimerit — server saadab millisekunditena
        socket.on(EVENTS.TIMER_UPDATE, (data) => {
            console.log("Countdown TIMER_UPDATE:", data);
            setTimeLeft(data.timeLeft);
        });

        // Kuulame režiimi muutust
        socket.on(EVENTS.MODE_CHANGED, (newMode) => {
            console.log("Countdown MODE_CHANGED:", newMode);
            setRaceMode(newMode);
        });

        // Kuulame sessiooni algust
        socket.on(EVENTS.SESSION_STARTED, () => {
            setRaceMode(RACE_MODES.SAFE);
        });

        // Kuulame sessiooni lõppu
        socket.on(EVENTS.SESSION_ENDED, () => {
            setRaceMode(RACE_MODES.ENDED);
            setTimeLeft(0);
        });

        return () => {
            socket.off(EVENTS.TIMER_UPDATE);
            socket.off(EVENTS.MODE_CHANGED);
            socket.off(EVENTS.SESSION_STARTED);
            socket.off(EVENTS.SESSION_ENDED);
        };
    }, []);

    // Mis teksti näidata vastavalt režiimile
    const getStatusText = () => {
        switch (raceMode) {
            case RACE_MODES.NOTSTARTED: return "Waiting for race to start";
            case RACE_MODES.SAFE:       return "Race in progress";
            case RACE_MODES.HAZARD:     return "Hazard — slow down";
            case RACE_MODES.DANGER:     return "Danger — stop";
            case RACE_MODES.FINISH:     return "Finish — return to pit lane";
            case RACE_MODES.ENDED:      return "Session ended";
            default:                    return "";
        }
    };

    // CSS klass vastavalt režiimile
    const getModeClass = () => {
        switch (raceMode) {
            case RACE_MODES.SAFE:   return "mode-safe";
            case RACE_MODES.HAZARD: return "mode-hazard";
            case RACE_MODES.DANGER: return "mode-danger";
            case RACE_MODES.FINISH: return "mode-finish";
            case RACE_MODES.ENDED:  return "mode-ended";
            default:                return "mode-waiting";
        }
    };

    return (
        <div className={`countdown-container ${getModeClass()}`}>
            <button
                className="fullscreen-btn"
                onClick={() => document.documentElement.requestFullscreen()}
            >
                Fullscreen
            </button>

            <div className="countdown-content">
                {/* Suur taimer keskel */}
                <div className="countdown-timer">
                    <Timer time={timeLeft} />
                </div>

                {/* Režiimi tekst */}
                <div className="countdown-status">
                    {getStatusText()}
                </div>
            </div>
        </div>
    );
};

export default Countdown;