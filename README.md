# 🏎️ Beachside Racetrack - Lap Tracking System
  
An event-driven real-time race management system built with **Socket.io** and **React** on **Node.js**. Includes role-specific interfaces for employees and public displays for spectators.
  
📱 🖥️ 💻 **Tablet and Mobile Device interfaces** - _Designed for use by track marshals and pit crew._  
  
## Table of contents  
<details>
<summary>Click to expand TOC</summary> 
  
1. [Architecture](#-architecture)  
2. [Requirements](#-requirements)
3. [Supported Versions](#-supported-versions)  
4. [Tech Stack](#-tech-stack)  
5. [Installation & Setup & Run](#-installation--setup--run)  
6. [Key Features & UI Modes](#-key-features--ui-modes)  
7. [Project Structure](#-project-structure)  
8. [Known Limitations](#-known-limitations)  
9. [Other](#-other)  
10. [FAQ](#-faq)  
11. [Authors, Roles, and Credits](#-authors-roles-and-credits)  
  
</details>
  
## 🏗️ Architecture  
  
**Bi-directional Event-Driven Architecture**.  
  
 -> No Polling - _Data is never requested via recurring GET/POST cycles._  
 -> Server-Push - _Persistent WebSocket connection with all clients._  
 -> State Management: _A centralised server-side state handles the timer and race modes; Data is pushed only when it changes._  

 ## ✅ Requirements

- Node.js: **18.x or newer**
- npm: **10.x or newer**
- Browser: modern Chromium-based browser or latest Firefox
- Local network access: open port **5173** for client and **3000** for server

### 📦 Supported Versions

| Package | Supported | Notes |
|---|---|---|
| Node.js | 18+ | Use LTS builds for stability |
| npm | 10+ | Bundled with Node.js 18+ |
| Vite | 8.x | `client/vite.config.js` enables `host: true` for LAN access |
| React | 19.x | Latest stable React 19 features |
| Express | 5.x | Server routing and middleware |
| Socket.IO | 4.8.x | Real-time event transport |

## 🧩 Tech Stack
| Category | Tech Stack |
|:---|:---|
| **Frontend** | ![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-5.0.12-443E38?style=flat-square) ![Vite](https://img.shields.io/badge/Vite-8.0.1-646CFF?style=flat-square&logo=vite&logoColor=white) ![Vite Plugin](https://img.shields.io/badge/%40vitejs%2Fplugin--react-6.0.1-646CFF?style=flat-square&logo=vite&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.IO_Client-4.8.3-010101?style=flat-square&logo=socket.io&logoColor=white) ![Rolldown](https://img.shields.io/badge/%40rolldown%2Fplugin--babel-0.2.1-FFCD3A?style=flat-square&logo=babel&logoColor=black) + React Router DOM v7.14.0 |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=flat-square&logo=express&logoColor=white) ![CORS](https://img.shields.io/badge/CORS-2.8.6-blue?style=flat-square) ![dotenv](https://img.shields.io/badge/dotenv-17.3.1-ECD53F?style=flat-square&logo=dotenv&logoColor=black) ![cross-env](https://img.shields.io/badge/cross--env-10.1.0-333333?style=flat-square) ![nodemon](https://img.shields.io/badge/nodemon-3.1.14-76D04B?style=flat-square&logo=nodemon&logoColor=white) |
| **Real-time** | ![Socket.io](https://img.shields.io/badge/Socket.IO-4.8.3-010101?style=flat-square&logo=socket.io&logoColor=white) |
| **Styling** | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) |
  
## ⚙️ Installation & Setup & Run

### 1. Install dependencies
Install scripts are provided at the root of the program:  
* **install.sh** - checks and installs Node.js dependencies  
* **makeandrun.sh** - same as install; also runs the program in production mode  

### 2. Pre-configure access codes
Setting access codes as environment variables in UNIX-type shells (Linux Bash, maxOS Terminal (zsh, bash), WSL (Windows Subsystem for Linux), Git Bash and others):  
  
`export FRONTDESK_KEY=your_key`  
`export LAPTRACKER_KEY=your_key`  
`export RACECONTROL_KEY=your_key`  
  
The values can be unset in UNIX-type shells in format `unset KEY`.  
-> ex: `unset FRONTDESK_KEY` for clearing after use.  
  
In a PowerShell environment, please use format `$env:KEY = "value"` for the above keys.  
-> `Remove-Item Env:KEY` for clearing after use.  
  
In Windows CMD, please use format `set KEY=value` for the above keys.  
-> `set KEY=`(leave value field empty) for clearing after use.  
  
### 3. Run server and client apps concurrently  
  
**In root folder _(info-screens)_**:  
  
* `npm start` to run in **production** mode  
 _(timer set to 10 min)_  
* `npm run dev` to run in **development** mode  
_(timer set to 1 min; DEV PANEL activated)_   
  
### 4. Open the app

- **Frontend:**  
`http://localhost:4173`  
_(`http://localhost:5173` while running dev mode)_  
  
- **Backend:**  
`http://localhost:3000`  
_(or custom port if using VITE_SERVER_PORT)_  

- **Network access (LAN):**  
`http://<host-ip>:5173`  
_(`http://<host-ip>:5173` while running dev mode)_  
  
> **Note:**  `client/vite.config.js` already includes `server.host = true`, so the Vite dev server should expose the network address when started from the `client` folder.  
  
> **Note:** custom port can be set for server<>client communication, example`export VITE_SERVER_PORT=3001` would set server<>client communication on port 3001

## 🛠️ Key Features & UI Modes
  
### 🏨 Reception / Front Desk 🖥️ 
- Adding, editing, removing race sessions  
- Managing drivers per session
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

## 📁 Project structure
  
<details>
<summary>Click to expand file tree</summary> 
  
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
├─ package-lock.json
├─ package.json
└─ server
   ├─ config
   │  └─ env.js
   ├─ data
   │  └─ .gitkeep
   ├─ package-lock.json
   ├─ package.json
   ├─ server.js
   ├─ services
   │  ├─ authService.js
   │  ├─ lapService.js
   │  ├─ raceService.js
   │  ├─ sessionService.js
      ├─ socket
   │  ├─ auth.js
   │  ├─ handlers
   │  │  ├─ lap.js
   │  │  ├─ race.js
   │  │  └─ session.js
   │  ├─ index.js
   ├─ state
   │  ├─ state.js
   │  ├─ stateMachine.js
   │  └─ timer.js
   └─ utils
      ├─ persistState.js
      └─ processEnvirVariables.js
```  
  
</details>

## 📌 Known Limitations  
  
- The current MVP does not fully secure Socket.IO event endpoints.  
- Authentication is present at the UI layer but not enforced for every event.  
- Persistent data is local and simple, not cloud-hosted, and without a database layer.  
  
## 🔑 Other  
* **Authentication:** role-based access to interactive interfaces.  
Access keys must be configured before running the server.
Employee interfaces prompt for access key before displaying content and controls. No token is persisted.  
Authentication is implemented on the UI level; credentials are sent to server for granting access.  
  
_Authentication is not enforced on Socket.IO events, meaning the UI is open for possible JavaScript injection, and replication of valid client behaviour, potentially allowing manipulation of data. No token is asked in MVP version._  
  
* **Dev-Panel:** collapsible control panel in dev-mode for easier testing. It reduces the need to switch between tabs/windows by allowing a tester to:  
  * generate sessions and drivers  
  * clear the frontdesk of all data  
  * start and end sessions  
  * use all race mode buttons  

* **Simplified Remote Access:** uses the Environment-Aware Connection String approach for portability and ease of deployment. Any device on the same network can access the UI by navigating to the hosts IP address.  
  
* **Persistence:** pushing live data to a local .json file allows races to continue smoothly after any possible server interruptions.  

## ❓ FAQ
* **Unable to run run the install scripts `./install.sh` or `./makeandrun.sh` in bash?**  
  * Please adjust `chmod +x install.sh && xhmod +x makeandrun.sh` and rerun the scripts  
* **How to build the required node package manually in bash?**  
  * Please use `cd client/ && npm install && cd ../server/ && npm install && cd .. && npm install`  
  
# 🧑‍🤝‍🧑🏆👏 Authors, Roles and Credits  
* **Olga Kuvatova** – project skeleton, session management, Front Desk views, DEV PANEL, and persistency  
  
* **Mihkel Truup** – project lead, state management, Race Control views, zustand, useRaceState React.js hook, and persistency  
  
* **Mari Virkus** – heartbeat and Socket.IO prototyping, lap tracking management, Lap Tracker views, and CSS  
  
* **Heilika Ots** – public facing views - Leaderboard, Next Race, Countdown, Race Flags, and CSS
  
* **Karl Lainestu** – mentoring and appreciation  