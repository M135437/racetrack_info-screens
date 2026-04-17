export const testSessions = [
    {
        id: 1,
        name: "10:00",
        maxSlots: 8,
        freeSlotsLeft: 3,
        status: "notStarted",
        drivers: [
            { id: 1, name: "Max", car: 1 },
            { id: 2, name: "Anna", car: 2 },
            { id: 3, name: "Leo", car: 3 },
            { id: 4, name: "Eva", car: 4 },
            { id: 5, name: "Tom", car: 5 }
        ]
    },
    {
        id: 2,
        name: "10:15",
        maxSlots: 8,
        freeSlotsLeft: 6,
        status: "notStarted",
        drivers: [
            { id: 6, name: "Mia", car: 1 },
            { id: 7, name: "John", car: 2 }
        ]
    },
    {
        id: 3,
        name: "10:30",
        maxSlots: 8,
        freeSlotsLeft: 0,
        status: "notStarted",
        drivers: [
            { id: 8, name: "Alex", car: 1 },
            { id: 9, name: "Nina", car: 2 },
            { id: 10, name: "Oleg", car: 3 },
            { id: 11, name: "Sara", car: 4 },
            { id: 12, name: "Ivan", car: 5 },
            { id: 13, name: "Kate", car: 6 },
            { id: 14, name: "Paul", car: 7 },
            { id: 15, name: "Lena", car: 8 }
        ]
    }
]