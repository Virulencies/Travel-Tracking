function calculateTotalSpentPerYear(tripsData, destinationsData) {
    let totalSpentPerYear = {};

    tripsData.forEach(trip => {
        const destination = destinationsData.find(dest => dest.id === trip.destinationID);
        if (destination) {
            const tripCost = (destination.estimatedLodgingCostPerDay * trip.duration + destination.estimatedFlightCostPerPerson * trip.travelers) * 1.1; // Including 10% agent fee
            
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