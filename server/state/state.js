let state = {
	races: [
	 	{
		id: 9,		// int  // race.id
		status: 'started', 	// string "upcoming", "started", "finished" // races.race1.status // NB! duplic hasStarted&isFinished
		startTimeStamp: 1775123702223,	// LocalDateTime // races.race1.startTimeStamp
		secondsLeft: 100641 ,	// int milliseconds // races.race1.secondsLeft
		startTime: 1775123702223,		// LocalDateTime // races.race1.startTime
		hasStarted: true, 	// boolean // races.race1.hasStarted
		isFinished: false, 	// boolean // races.race1.isFinished
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