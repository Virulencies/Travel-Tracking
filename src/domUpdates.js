

function displayTravelerDashboard(travelerData) {
    const travelerName = document.getElementById('traveler-name');
    travelerName.textContent = `Welcome back, ${travelerData.name}! Here are your trip spending details:`;

}

function displayTrips(tripsData, destinationsData) {
    const pendingTripsContainer = document.getElementById('pending-trips-container');
    const approvedTripsContainer = document.getElementById('approved-trips-container');
    
    pendingTripsContainer.innerHTML = '';
    approvedTripsContainer.innerHTML = '';

    const pendingTrips = tripsData.filter(trip => trip.status === 'pending');
    const approvedTrips = tripsData.filter(trip => trip.status === 'approved' || trip.status === 'ongoing');

    pendingTrips.forEach(trip => {
        const tripElement = createTripElement(trip, destinationsData);
        pendingTripsContainer.appendChild(tripElement);
    });

    approvedTrips.forEach(trip => {
        const tripElement = createTripElement(trip, destinationsData);
        approvedTripsContainer.appendChild(tripElement);
    });
}

function createTripElement(trip, destinationsData) {
    const destination = destinationsData.find(dest => dest.id === trip.destinationID);
    const tripElement = document.createElement('div');
    tripElement.className = 'trip';
    tripElement.innerHTML = `
        <h4>${destination ? destination.destination : 'Unknown Destination'} (Booking ID: ${trip.id})</h4>
        <p>Date: ${trip.date}, Duration: ${trip.duration} days, Status: ${trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}</p>
    `;
    return tripElement;
}

function displayAddedTrip(trip, message) {
    const tripsContainer = document.getElementById('trips-container');
    const newTripElement = document.createElement('div');
    newTripElement.innerHTML = `
        <h3>${trip.destinationName} (Trip Booking ID: ${trip.id})</h3>
        <p>Date: ${trip.date}, Duration: ${trip.duration} days, Status: ${trip.status}</p>
    `;
    if(trip.status === 'pending') {
        tripsContainer.insertBefore(newTripElement, tripsContainer.firstChild);
    } else {
        tripsContainer.appendChild(newTripElement);
    }

    const messageContainer = document.getElementById('trip-submission-message');
    messageContainer.textContent = message;
}

function displayTotalSpentPerYear(totalSpentPerYear) {
    const totalSpentContainer = document.getElementById('total-spent-container');
    totalSpentContainer.innerHTML = '';

    // create and append elements for each year's total
    Object.keys(totalSpentPerYear).forEach(year => {
        const yearTotal = document.createElement('p');
        yearTotal.textContent = `You've spent $${totalSpentPerYear[year].toFixed(2)} on trips in ${year}`;
        totalSpentContainer.appendChild(yearTotal);
    });
}

function populateDestinations(destinationsData, destinationSelect) {
    destinationsData.forEach(destination => {
        let option = document.createElement('option');
        option.value = destination.id;
        option.textContent = destination.destination;
        option.setAttribute('data-estimated-lodging-cost-per-day', destination.estimatedLodgingCostPerDay);
        option.setAttribute('data-estimated-flight-cost-per-person', destination.estimatedFlightCostPerPerson);
        destinationSelect.appendChild(option);
    });
}

// Exports
export { displayTravelerDashboard, displayTrips, displayTotalSpentPerYear, displayAddedTrip, populateDestinations };