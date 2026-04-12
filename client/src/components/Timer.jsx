function formatTime(ms) {
    if (ms === null || ms === undefined) return "00:00";

    const positiveMs = Math.max(0, ms);

    const totalSeconds = Math.floor( positiveMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function Timer({time}) {
    return <div className="timer">{formatTime(time)}</div>;
}

export default Timer;