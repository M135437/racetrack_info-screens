import { ENV_VARIABLES } from "../config/env.js"

//check if any environment variables are missing
const missing = Object.entries(ENV_VARIABLES)
  .filter(([, v]) => !v)    // stream expl: only takes elements where key:value is falsy (undefined,null,"",0,false)
  .map(([k]) => k);         // adding missing items to array

  export default function processEnvVar() {
    // provide usage and exit process if missing mandatory env. variables
    if (missing.length > 0) {
        console.error('\n╔═════════════════════════════════════════════════════════════╗');
        console.error('║  ERROR: Missing mandatory environment variables             ║');
        console.error('╠═════════════════════════════════════════════════════════════╣');
        missing.forEach(k => console.error(`║  ✗ ${k.padEnd(57)}║`));
        console.error('╠═════════════════════════════════════════════════════════════╣');
        console.error('║  Usage:                                                     ║');
        console.error('║  export FRONTDESK_KEY=your_key                              ║');
        console.error('║  export LAPTRACKER_KEY=your_key                             ║');
        console.error('║  export RACECONTROL_KEY=your_key                            ║');
        console.error('║  export RACETRACK_SERVER_PORT=your_server port (optional)   ║');
        console.error('║  npm start                                                  ║');
        console.error('╚═════════════════════════════════════════════════════════════╝\n');
        process.exit(1);
    }
}