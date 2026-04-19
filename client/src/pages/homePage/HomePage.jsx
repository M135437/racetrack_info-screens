import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
    return (
        <div className="homepage-container">
        <div className="homepage-card">
            <header className="homepage-header">
            <h1>Beachside Racetrack</h1>
            </header>
        <section>
            <h2>Choose your role:</h2>
            <div className="role-menu">
                <Link className="role-link" to="/front-desk">Front Desk</Link>
                <Link className="role-link" to="/race-control">Race Controller</Link>
                <Link className="role-link" to="/lap-line-tracker">Lap Tracker</Link>
            </div>
        </section>

        <section>
            <h2>Public displays:</h2>
            <div className="role-menu">
                <Link className="role-link" to="/leader-board">Leaderboard</Link>
                <Link className="role-link" to="/next-race">Next Race</Link>
                <Link className="role-link" to="/race-countdown">Countdown Timer</Link>
                <Link className="role-link" to="/race-flags">Flag Display</Link>
            </div>
        </section>
        </div>
        </div>
    )
}

export default HomePage;