import { useEffect } from "react";
import "./Countdown.css";
import { useRaceState } from "../../hooks/useRaceState";
import { RACE_MODES } from "../../shared/types";
import Timer from "../../components/Timer";

const Countdown = () => {
    const { time, raceMode, listenSocket } = useRaceState();

    useEffect(() => {
        listenSocket();
    }, []);

    const getStatusText = () => {
        switch (raceMode) {
            case RACE_MODES.NOTSTARTED: return "Waiting to start";
            case RACE_MODES.SAFE:       return "Race in progress";
            case RACE_MODES.HAZARD:     return "Hazard — slow down";
            case RACE_MODES.DANGER:     return "Danger — stop";
            case RACE_MODES.FINISH:     return "Finish — return to pit";
            case RACE_MODES.ENDED:      return "Session ended";
            default:                    return "Waiting to start";
        }
    };

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
                {/* taimer keskel — saab time hookist */}
                <div className="countdown-timer">
                    <Timer time={time} />
                </div>

                {/* režiimi tekst taimeri all */}
                <div className="countdown-status">
                    {getStatusText()}
                </div>
            </div>
        </div>
    );
};

export default Countdown;