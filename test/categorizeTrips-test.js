function categorizeTrips(tripsData) {
    const categorizedTrips = {
        pending: [],
        approved: []
    };

    tripsData.forEach(trip => {
        if (trip.status === 'pending') {
            categorizedTrips.pending.push(trip);
        } else if (trip.status === 'approved' || trip.status === 'ongoing') {
            categorizedTrips.approved.push(trip);
        }
    });

    return categorizedTrips;
}


module.exports = { categorizeTrips }