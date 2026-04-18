let state = {
	sessions: [],	// sessions massiivi lõpp

	runningRace: null, 	// initially null, upon start or equals(race.id) -> use as pointer to state.races.{}
	nextRace: 0,	// initially 0, increments to next session id as soon as session/race starts
	raceMode: 'notStarted', 	// initially 'notStarted', options 'safe', 'hazard', 'danger', 'finishing', 'ended'
	session: 'started', //'null', 'started' or 'ended' once 10mins/1min runs out
	timer: {
		duration: null,              // 600 000 ms = 10 min, dev 60 000 = 1 min // set by env var DEV MODE
		timeRemaining: null,          // ms value for heartbeat
		startTime: null,       // LocalDateTime -- when was session started
		endTime: null,                  // LocalDateTime -- when does session run out of time (REVIEW - non-mandatory)
		timerStatus: null
	},

	leaderboard: [],
};

export default state;