let state = {
	races: [
	 	{
		id: 9,		// int  // race.id
		status: 'started', 	// string "upcoming", "started", "finished" // races.race1.status // NB! duplicate against hasStarted&isFinished
		startTimeStamp: 1775123702223,	// LocalDateTime // races.race9.startTimeStamp
		secondsLeft: 100641 ,	// int milliseconds // races.race1.secondsLeft  // REVIEW @MARI - secondsLeft --> msLeft? OK? NOT_OK?
		startTime: 1775123702223,		// LocalDateTime // races.race1.startTime
		hasStarted: true, 	// boolean // races.race1.hasStarted
		isFinished: false, 	// boolean // races.race1.isFinished
		drivers: [
			{
			id: 7,		                    // int (incrementing) // racers.racer1.id
			name: 'näidisvõidusõitja Paul', // string // racers.racer1.name
			car: 6,		                    // int (1-99) // racers.racer1.car // REVIEW - string võimaldaks nt 'Ferrari Red', 'Yellow Mercedes' 
			lapCount: 5,                    // int // racers.racer1.lapCount
			lastLapTimeStamp: 1775123702223, // alguses null, katsetame "2026-04-02T09:55:02.223Z" // racers.racer1.lastLapTimeStamp
			bestLapTime: 499359,            // alguses null, katsetame racers.racer1.bestLapTime // int millisekundite väljendamiseks
			isFinished: false               // boolean // racers.racer1.isFinished
			}
			// ... kuni racer8
		],  // racers massiivi lõpp
		} 	// ... kuni indefinited race#
		],	// races massiivi lõpp
	
	currentRace: null, 	// initially null, upon start or equals(race.id) -> use as pointer to state.races.{}
	nextRace: 0,	// initially 0, increments to 1 as soon as session/race 0 starts
    raceMode: 'notStarted', 	// initially 'notStarted', options 'safe', 'hazard', 'danger', 'finish'
    session: 'started', //'null', 'started' or 'ended' once 10mins/1min runs out
    timer: {
        duration: 6000000,              // 600 000 ms = 10 min, dev 60 000 = 1 min // REVIEW - needs to be connected to npm run / npm run dev setup
        timeRemaining: 100641,          // ms value for heartbeat
        startTime: 1775123702223,       // LocalDateTime -- when was session started
        endTime: null,                  // LocalDateTime -- when does session run out of time (REVIEW - non-mandatory)
        timerStatus: null
    },

    leaderboard: [],
	};

export default state;