# 🏎️ Beachside Racetrack - Lap Tracking System
  
An event-driven race management system built with **Socket.io** and **React**.  
  
**Tablet and Mobile Device interfaces**  
📱 🖥️ 💻 Designed for use by track marshals and pit crew.  
  
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
**Leaderboard:** for public areas to be viewed by spectators.  
Includes countdown timer and race safety indicator.   
**Next Race:** for public areas to be viewed by participants and spectators.  
Signals subsequent participants to head to paddock.  
**Countdown:** for public areas and around the track to be viewed by spectators and participants. 
**Flag Screens:** to be used around the track for notifying drivers and officials of racetrack safety.  
_All displays support fullscreen-view._  
  
### 🔑 Other  
**Authentication:** role-based access to interactive interfaces.  
Access key must be provided upon running the server.  
**Dev-Panel:** collapsible control panel avaliable in dev-mode for easier testing. The panel allows a tester to  
- generate sessions and drivers  
- clear the frontdesk of all data  
- 'start' and 'end' sessions  
- use all race mode buttons  
, reducing the need to switch between tabs/windows.  
  
## 📅 WIP
   
- [] **Remote Access:** - tunneling set-up for off-site monitoring.  
- [] **History:** - adding persistence for racetime storage. 
  
