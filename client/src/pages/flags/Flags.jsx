import { useEffect } from "react";
import "./Flags.css";
import { useRaceState } from "../../hooks/useRaceState";
import { RACE_MODES } from "../../shared/types";

const Flags = () => {
    // raceMode tuleb hookist
    const { raceMode, listenSocket } = useRaceState();

    useEffect(() => {
        listenSocket();
    }, []);

    // õige CSS klass vastavalt režiimile
    const getFlagClass = () => {
        switch (raceMode) {
            case RACE_MODES.SAFE:     return "flag-safe";
            case RACE_MODES.HAZARD:   return "flag-hazard";
            case RACE_MODES.DANGER:   return "flag-danger";
            case RACE_MODES.FINISH:   return "flag-finish";
            case RACE_MODES.ENDED:    return "flag-danger";
            default:                  return "flag-danger";
        }
    };

    return (
        <div className={`flags-container ${getFlagClass()}`}>
            <div className="fullscreen-btn-wrapper">
                <button onClick={() => document.documentElement.requestFullscreen()}>
                    Fullscreen
                </button>
            </div>

            {/* FINISH režiimil ruuduline overlay */}
            {raceMode === RACE_MODES.FINISH && (
                <div className="chequered-overlay"></div>
            )}
        </div>
    );
};

export default Flags;