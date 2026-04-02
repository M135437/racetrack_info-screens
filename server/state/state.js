let state = {
	races: [
	 	{
		id: race.id,		// int
		status: races.race1.status, 	// string "upcoming", "started", "finished" // NB! duplic hasStarted&isFinished
		startTimeStamp: races.race1.startTimeStamp,	// LocalDateTime
		secondsLeft: races.race1.secondsLeft,	// int
		startTime: races.race1.startTime,		// LocalDateTime
		hasStarted: races.race1.hasStarted, 	// boolean
		isFinished: races.race1.isFinished, 	// boolean
		racers: [
			{
			id: 7,		                    // int (incrementing) // racers.racer1.id
			name: 'näidisvõidusõitja Paul', // string // racers.racer1.name
			car: 6,		                    // int (1-99) // racers.racer1.car
			lapCount: 5,                    // int // racers.racer1.lapCount
			lastLapTimeStamp: 1775123702223, // alguses null, katsetame "2026-04-02T09:55:02.223Z" // racers.racer1.lastLapTimeStamp
			bestLapTime: 499359,            // alguses null, katsetame racers.racer1.bestLapTime // int millisekundite väljendamiseks
			isFinished: false               // boolean // racers.racer1.isFinished
			}
			// ... kuni racer8
		],  // racers massiivi lõpp
		} 	// ... kuni indefinited race#
		],	// races massiivi lõpp
	
	currentRace: null, 	// initially null, upon start or equals(race.id)
	nextRace: 0,	// initially 0, increments to 1 as soon as session/race 0 starts
	raceMode: 'notStarted', 	// initially 'notStarted', options 'safe', 'hazard', 'danger', 'finish'
	leaderboard: []
	};

export default state;