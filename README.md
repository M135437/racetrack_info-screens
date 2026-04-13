# Beachside Racetrack Info-Screens

A real-time race management and spectator information system built with Node.js, Socket.IO and React.

---

## Setup & Installation

### Requirements
- Node.js installed
- npm installed

### Install dependencies

```bash
cd client/ && npm install && cd ../server/ && npm install && cd ..
```

> Note: also check that `cross-env` is installed:
> ```bash
> npm install cross-env --save-dev
> ```

---

## Starting the server

### Environment variables (required)

The server will not start without these. Set them before running:

```bash
export RECEPTIONIST_KEY=your_key_here
export OBSERVER_KEY=your_key_here
export SAFETY_KEY=your_key_here
```

Example:
```bash
export RECEPTIONIST_KEY=8ded6076
export OBSERVER_KEY=662e0f6c
export SAFETY_KEY=a2d393bc
```

### Run in production mode (10 min race timer):
```bash
cd server
npm start
```

### Run in development mode (1 min race timer):
```bash
cd server
npm run dev
```

### Run the client:
```bash
cd client
npm run dev
```

---

## Interfaces

| Interface        | Who uses it       | Route               | Password needed |
|-----------------|-------------------|---------------------|-----------------|
| Front Desk      | Receptionist      | `/front-desk`       | Yes             |
| Race Control    | Safety Official   | `/race-control`     | Yes             |
| Lap Tracker     | Lap Observer      | `/lap-line-tracker` | Yes             |
| Leader Board    | Spectators        | `/leader-board`     | No              |
| Next Race       | Race Drivers      | `/next-race`        | No              |
| Race Countdown  | Race Drivers      | `/race-countdown`   | No              |
| Race Flags      | Race Drivers      | `/race-flags`       | No              |

---

## User guide

### How a race session works

1. **Receptionist** opens `/front-desk` and creates a new race session with driver names
2. **Race drivers** check `/next-race` to see their name and assigned car number
3. **Safety Official** opens `/race-control` and presses **Start** once drivers are briefed
4. **Lap Observer** opens `/lap-line-tracker` and presses the car's button each time it crosses the lap line
5. **Spectators** follow `/leader-board` to see live lap times and race status
6. **Race flags** screen `/race-flags` shows the current flag colour to drivers around the track
7. When the race ends, the Safety Official presses **End Session**
8. Drivers check `/next-race` for the paddock message and next session info

---

## Public screens (no password needed)

These are designed to run on large displays (40–75 inch screens) around the track.
Each screen has a **Fullscreen** button to hide the browser UI.

### Leader Board `/leader-board`
- Shows all drivers ordered by fastest lap time
- Updates in real time when a lap is recorded
- Shows remaining race time and current flag status

### Next Race `/next-race`
- Shows drivers and car numbers for the upcoming session
- Switches automatically when the current race starts
- Shows a paddock message when the Safety Official ends the session

### Race Flags `/race-flags`
- Full screen colour display — no text, just colour
- Green = Safe, Yellow = Hazard, Red = Danger, Chequered = Finish
- Updates instantly when the Safety Official changes the race mode

---

## Testing on other devices (phones, tablets)

To access the interfaces from another device on the same wifi network:

1. Make sure `client/vite.config.js` contains:
```js
server: {
  host: true,
  port: 5173
}
```

2. Restart the client (`Ctrl+C` then `npm run dev`)

3. Look for the `Network:` address in the terminal:

Local:   http://localhost:5173/
Network: http://YOUR_LOCAL_IP:5173/

4. Open that `Network` address on your phone or tablet.

> ⚠️ Only use this on a trusted private network, not on public wifi.

---

## Tech stack

- **Server:** Node.js, Socket.IO, Express
- **Client:** React, Vite
- **Real-time:** Socket.IO (no polling — all updates via socket events)