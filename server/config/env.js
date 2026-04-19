import path from "path";
import { fileURLToPath } from 'url';
// environment variables for interface access
export const ENV_VARIABLES = {
    FRONTDESK_KEY: process.env.FRONTDESK_KEY,
    LAPTRACKER_KEY: process.env.LAPTRACKER_KEY,
    RACECONTROL_KEY: process.env.RACECONTROL_KEY,
    VITE_SERVER_PORT: process.env.VITE_SERVER_PORT || 3000 // sets port 3000 if not assigned
};

const DEV_MODE = process.env.DEV_MODE === 'true';       // true or false
export const RACE_DURATION = DEV_MODE ? (60*1000) : (600*1000) ;              // (seconds * ms)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const DATA_FILE = path.join(__dirname, '../data/data.json');

export default { ENV_VARIABLES, RACE_DURATION };