let driverId = 1000

const names = ["Max", "Anna", "Leo", "Eva", "Tom", "Nina", "Oleg", "Sara"]

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomName() {
    return names[randomInt(0, names.length - 1)]
}

export function generateSessions(count = 5) {
    const sessions = []

    for (let i = 0; i < count; i++) {
        const driversCount = randomInt(0, 8)

        const drivers = Array.from({ length: driversCount }).map(() => ({
            id: driverId++,
            name: randomName(),
            car: randomInt(1, 8)
        }))

        sessions.push({
            name: `${10 + i}:00`,
            maxSlots: 8,
            freeSlotsLeft: 8 - drivers.length,
            status: "notStarted",
            drivers
        })
    }

    return sessions
}