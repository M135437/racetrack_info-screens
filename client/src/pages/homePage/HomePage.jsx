// esileht, et oleks kuskil kuvada kõikide liideste nuppe

// eraldi failina, sest ehki teeme MVP, siis ~tulevikusoovide~ mõistes
// scalable omaette failiga lähenemine mõistlik

import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
    return (
        <div className="homepage-container">
            <header className="homepage-header">
            <h1>Welcome to Beachside Racetrack!</h1>
            </header>
        <section>
            <h2>Choose your role:</h2>
            <div className="menu">
                <Link className="role-link" to="/front-desk">Front Desk</Link>
                <Link className="role-link" to="/race-control">Race Controller</Link>
                <Link className="role-link" to="/lap-line-tracker">Lap Tracker</Link>
            </div>
        </section>

        <section>
            <h2>Public displays:</h2>
            <div className="menu">
                <Link className="role-link" to="/leader-board">Leaderboard</Link>
                <Link className="role-link" to="/next-race">Next Race</Link>
                <Link className="role-link" to="/race-countdown">Countdown Timer</Link>
                <Link className="role-link" to="/race-flags">Flag Display</Link>
            </div>
        </section>
        </div>
    )
}

/* hetkel loetelu kole, aga pmst saab lahti css-is:
ul.no-bullets {
  list-style-type: none;
  padding: 0;
  margin: 0;
} */

export default HomePage;