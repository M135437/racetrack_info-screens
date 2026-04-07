// esileht, et oleks kuskil kuvada kõikide liideste nuppe

// eraldi failina, sest ehki teeme MVP, siis ~tulevikusoovide~ mõistes
// scalable omaette failiga lähenemine mõistlik

import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div>
        <div>
            <h1>
                Welcome to Beachside Racetrack!
            </h1>
            <h2>
                Choose your role:
            </h2>
            <ul>
            <li><Link to="/front-desk">Front Desk</Link></li>
            <li><Link to="/race-control">Race Controller</Link></li>
            <li><Link to="/lap-line-tracker">Lap Tracker</Link></li>
            </ul>
        </div>
        <div>
            <h2>
                Public displays:
            </h2>
            <ul>
            <li><Link to="/leader-board">Leaderboard</Link></li>
            <li><Link to="/next-race">Next Race</Link></li>
            <li><Link to="/race-countdown">Countdown Timer</Link></li>
            <li><Link to="/race-flags">Flag Display</Link></li>
            </ul>
        </div>
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