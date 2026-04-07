// esileht, et oleks kuskil kuvada kõikide liideste nuppe

function HomePage() {
    return (
        <div>
            <h1>
                Welcome to Beachside Racetrack!
            </h1>
            <h2>
                Choose your role:
            </h2>
            <Link to="/front-desk">Front Desk</Link>
            <Link to="/race-control">Race Controller</Link>
            <Link to="/lap-line-tracker">Lap Tracker</Link>
            <h2>
                Public displays:
            </h2>
            <Link to="/leader-board">Leaderboard</Link>
            <Link to="/next-race">Next Race</Link>
            <Link to="/race-countdown">Countdown Timer</Link>
            <Link to="/race-flags">Flag Display</Link>
        </div>
    )
}