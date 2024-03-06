const users = [
    { username: "traveler1", password: "travel" },
    { username: "traveler2", password: "password" }
];

const sampleTripsData = {
    trips: [
        {
            id: 1,
            userID: 44,
            destinationID: 49,
            travelers: 1,
            date: "2022/09/16",
            duration: 8,
            status: "approved",
            suggestedActivities: []
        },
        {
            id: 2,
            userID: 44,
            destinationID: 50,
            travelers: 2,
            date: "2022/12/22",
            duration: 5,
            status: "approved",
            suggestedActivities: []
        },
        {
            id: 3,
            userID: 45,
            destinationID: 51,
            travelers: 1,
            date: "2023/01/30",
            duration: 10,
            status: "approved",
            suggestedActivities: []
        },
        {
            id: 4,
            userID: 46,
            destinationID: 49,
            travelers: 4,
            date: "2023/04/25",
            duration: 12,
            status: "pending",
            suggestedActivities: []
        },
        {
            id: 5,
            userID: 46,
            destinationID: 51,
            travelers: 2,
            date: "2024/04/25",
            duration: 12,
            status: "pending",
            suggestedActivities: []
        }
    ]
};


const sampleDestinationsData = [
    {
        id: 49,
        destination: "Lima, Peru",
        estimatedLodgingCostPerDay: 70,
        estimatedFlightCostPerPerson: 400
    },
    {
        id: 50,
        destination: "Santiago, Chile",
        estimatedLodgingCostPerDay: 90,
        estimatedFlightCostPerPerson: 350
    },
    {
        id: 51,
        destination: "Quito, Ecuador",
        estimatedLodgingCostPerDay: 60,
        estimatedFlightCostPerPerson: 500
    },
];


module.exports = { sampleTripsData, sampleDestinationsData, users}