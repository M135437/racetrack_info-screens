# 🏎️ Beachside Racetrack - Lap Tracking System
  
An event-driven race management system built with **Socket.io** and **React**.  
  
📱 🖥️ 💻 **Tablet and Mobile Device interfaces** - _Designed for use by track marshals and pit crew._  
  
| Category | Tech Stack |
|:---:|:---:|
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Zustand](https://img.shields.io/badge/Zustand-443322?style=for-the-badge&logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) |
| **Real-time** | ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white) |
| **Styling** | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) |
  
## 🏗️ Architecture  
  
**Bi-directional Event-Driven Architecture**.  
  
 -> No Polling - _Data is never requested via recurring GET/POST cycles._  
 -> Server-Push - _Persistent WebSocket connection with all clients._  
 -> State Management: _A centralised server-side state handles the timer and race modes; Data is pushed only when it changes._  
   
## Project Structure  
  
```
info-screens
├─ README.md
├─ client
│  ├─ README.md
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ AuthorizationScreen.jsx
│  │  │  ├─ ControlButton.jsx
│  │  │  ├─ NoSessionsState.jsx
│  │  │  ├─ PageHeader.jsx
│  │  │  ├─ ReturnToPaddock.jsx
│  │  │  ├─ SessionListing.jsx
│  │  │  ├─ Timer.jsx
│  │  │  └─ sessions
│  │  │     ├─ SessionCard.jsx
│  │  │     └─ sessionCard.css
│  │  ├─ dev
│  │  │  ├─ DevPanel.jsx
│  │  │  ├─ devData.js
│  │  │  └─ devGenerator.js
│  │  ├─ hooks
│  │  │  └─ useRaceState.js
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ countdown
│  │  │  │  ├─ Countdown.css
│  │  │  │  └─ Countdown.jsx
│  │  │  ├─ flags
│  │  │  │  ├─ Flags.css
│  │  │  │  └─ Flags.jsx
│  │  │  ├─ frontDesk
│  │  │  │  ├─ FrontDesk.jsx
│  │  │  │  └─ frontDesk.css
│  │  │  ├─ homePage
│  │  │  │  ├─ HomePage.css
│  │  │  │  └─ HomePage.jsx
│  │  │  ├─ lapTracker
│  │  │  │  ├─ LapTracker.css
│  │  │  │  └─ LapTracker.jsx
│  │  │  ├─ leaderboard
│  │  │  │  ├─ LeaderboardPage.css
│  │  │  │  └─ LeaderboardPage.jsx
│  │  │  ├─ nextRace
│  │  │  │  ├─ NextRace.css
│  │  │  │  └─ NextRace.jsx
│  │  │  └─ raceControl
│  │  │     └─ RaceControl.jsx
│  │  ├─ shared
│  │  │  ├─ events.js
│  │  │  └─ types.js
│  │  └─ socket
│  │     └─ socket.js
│  └─ vite.config.js
├─ install.sh
├─ makeandrun.sh
├─ mockBrowserOnSocket.js
├─ package-lock.json
├─ package.json
└─ server
   ├─ config
   │  └─ env.js
   ├─ mockBrowserOnSocket.js
   ├─ package-lock.json
   ├─ package.json
   ├─ server.js
   ├─ services
   │  ├─ authService.js
   │  ├─ lapService.js
   │  ├─ raceService.js
   │  ├─ sessionService.js
   │  └─ testSessionService.js
   ├─ socket
   │  ├─ auth.js
   │  ├─ handlers
   │  │  ├─ lap.js
   │  │  ├─ race.js
   │  │  └─ session.js
   │  ├─ index.js
   │  └─ testClient.js
   ├─ state
   │  ├─ state.js
   │  ├─ stateMachine.js
   │  ├─ testTimer.js
   │  └─ timer.js
   └─ utils
      ├─ carAssignment.js
      └─ processEnvirVariables.js

```

## ⚙️ Installation & Setup
  
Täidame siis _päriselt_, kui auth ja tunneling olemas, aga peab olemas olema:  
`npm run dev` <- mis käivitab dev-mode, kus taimer 1min  
`npm start` <- mis käivitab produ-süsteemi; taimer 10min 
  
## 🛠️ Features & UI Modes
  
### 🏨 Reception / Front Desk 🖥️ 
- Adding, editing, removing race sessions  
- Adding, editing, removing drivers  
- Assigning cars to drivers both manually and automatically  
- Automatic-handling of duplicate participant names and car numbers  
  
### 🛡️ Safety Official / Race Control 📱 
- Starting, finishing, and closing race sessions  
- Switching between race-modes to ensure safety  
- Includes driver list of upcoming session   
  
### ⏱️ Lap Observer / Lap Tracker 📱 
- Handling lap-line crossings  
- Include Race safety indicator and countdown timer  
- Includes large hard-to-miss buttons  
- Buttons automatically sorted by car number  
- Cooldown on buttons to prevent accidental double-tapping  
- Supports landscape and portrait views for mobile devices  
- Supports fullscreen view  
  
### 🖥️ Displays
- **Leaderboard:** for public areas to be viewed by spectators.  
Includes countdown timer and race safety indicator.   
- **Next Race:** for public areas to be viewed by participants and spectators.  
Signals subsequent participants to head to paddock.  
- **Countdown:** for public areas and around the track to be viewed by spectators and participants. 
- **Flag Screens:** to be used around the track for notifying drivers and officials of racetrack safety.  
_All displays support fullscreen-view._  
  
### 🔑 Other  
* **Authentication:** role-based access to interactive interfaces.  
Access key must be provided upon running the server.  
* **Dev-Panel:** collapsible control panel in dev-mode for easier testing. It reduces the need to switch between tabs/windows by allowing a tester to:  
  * generate sessions and drivers  
  * clear the frontdesk of all data  
  * start and end sessions  
  * use all race mode buttons  
* **Simplified Remote Access:** uses the Environment-Aware Connection String approach for portability and ease of deployment. Any device on the same network can access the UI by navigating to the hosts IP address.  
* **Persistence:** pushing live data to a local .json file allows races to continue smoothly after any possible server interruptions.  