function calculateTotalSpentPerYear(sampleTripsData, sampleDestinationsData) {
    let totalSpentPerYear = {};
    console.log("gdfgdfgegertg", typeof sampleTripsData);
    sampleTripsData.trips.forEach(trip => {
        const destination = sampleDestinationsData.find(dest => dest.id === trip.destinationID);
        if (destination) {
            const tripCost = (destination.estimatedLodgingCostPerDay * trip.duration + destination.estimatedFlightCostPerPerson * trip.travelers) * 1.1;
            
            const year = new Date(trip.date).getFullYear();
            
            if (!totalSpentPerYear[year]) {
                totalSpentPerYear[year] = 0;
            }
            
            totalSpentPerYear[year] += tripCost;
        }
    });

    return totalSpentPerYear;
}

module.exports = { calculateTotalSpentPerYear }