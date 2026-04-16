# Beachside Racetrack - Lap Tracking System
  
An event-driven race management system built with **Socket.io** and **React**.  
  
**Tablet and Mobile Device interfaces**  
Designed for use by track marshals and pit crew  
  
| **Frontend** | React (Vite), Zustand |
| **Backend** | Node.js, Express |
| **Real-time** | Socket.io (Websockets) |
| **Styling** | CSS3 (Flexbox/Grid) |
  
## Architecture  
  
**Bi-directional Event-Driven Architecture**.  
  
 -> No Polling - _Data is never requested via recurring GET/POST cycles._  
 -> Server-Push - _Persistent WebSocket connection with all clients._  
 -> State Management: _A centralised server-side state handles the timer and race modes; Data is pusehd only when it changes._  
   
## Installation & Setup
  
Täidame siis _päriselt_, kui auth ja tunneling olemas, aga peab olemas olema:  
`npm start` <- mis käivitab produ-süsteemi; taimer 10min  
`npm run dev` <- mis käivitab dev-mode, kus taimer 1min  
  
## Features & UI Modes
  
### Reception / Front Desk
- Adding, editing, removing race sessions  
- Adding, editing, removing drivers  
- Assigning cars to drivers  
- Naming sessions and providing estimated start times  
  
### Safety Official / Race Control
- Starting, finishing, and closing race sessions  
- Switching between race-modes to ensure safety  
- Sees drivers for upcoming races  
  
### Lap Observer / Lap Tracker
- Handling lap-line crossings  
- Large hard-to-miss buttons  
- Cooldown on buttons to prevent accidental double-tapping  
- Buttons automatically sorted by car number  
- Race Mode changes and countdown-timer visible in header  
- Supports landscape view for tablets  
- Supports fullscreen view  
  
### Displays
**Leaderboard:** for public areas to be viewed by spectators.  
**Countdown:** for public areas and around the track to be viewed by spectators and participants.  
**Flag Screens:** around the track to notify drivers and officials of safety.  
_All displays support fullscreen-view._  
  
## WIP
  
- [] **Authentification:** - role-based access to interactive interfaces. Currently has a placeholder auth-gate with hardcoded password.  
- [] **Remote Access:** - tunneling set-up for off-site monitoring.  
- [] **History:** - adding persistence for racetime storage.  
  
