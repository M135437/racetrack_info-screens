let state = {
	sessions: [],	// sessions massiivi lõpp

	runningRace: null, 	// initially null, upon start or equals(race.id) -> use as pointer to state.races.{}
	nextRace: 0,	// initially 0, increments to next session id as soon as session/race starts
	raceMode: 'notStarted', 	// initially 'notStarted', options 'safe', 'hazard', 'danger', 'finishing', 'ended'
	timer: {
		duration: null,              // 600 000 ms = 10 min, dev 60 000 = 1 min // set by env var DEV MODE
		timeRemaining: null,          // ms value for heartbeat
		startTime: null,       // LocalDateTime -- when was session started
		timerStatus: null
	},

	leaderboard: [],
};

export function correctTimeAfterStartup(io) {

	// if there is no timer or startTime, it means there is no active timer that needs to be corrected, so we can simply return without doing anything. 
	// This check prevents potential errors that could arise from trying to access properties of an undefined timer object or a null startTime.
	if (!state.timer.startTime) {
		console.log("Recovery: no active timer")
		return
	}

	const now = Date.now()
	const elapsed = now - state.timer.startTime
	const remaining = state.timer.duration - elapsed

	if (remaining <= 0) {
		console.log("Recovery: timer already finished")

		state.timer.timeRemaining = 0
		state.timer.timerStatus = null

		return
	}

	state.timer.timeRemaining = remaining

	console.log(`Recovery: ${Math.floor(remaining / 1000)} sec left`)

	// interval needs to be restarted after server restarts, 
	// so we call startTimer to ensure that the timer continues to function correctly 
	// and emits updates to clients as expected.
	startTimer(io)
}

export default state;