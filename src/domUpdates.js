

function displayTravelerDashboard(travelerData) {
    // Assuming your HTML has a div or some container with this ID where you want to display the user's name
    const travelerName = document.getElementById('traveler-name');
    travelerName.textContent = `Welcome back, ${travelerData.name}!`;

    // Add more details as needed, such as traveler type, etc.
    // For example, if you want to display the traveler's type:
    // const travelerTypeEl = document.getElementById('traveler-type');
    // travelerTypeEl.textContent = `Type: ${travelerData.travelerType}`;
}

function displayTravelerInfo(travelerData) {
    // Logic to display traveler information
}

function displayTrips(tripsData, destinationsData) {
    const tripsContainer = document.getElementById('trips-container');
    tripsContainer.innerHTML = '';

    const pendingTrips = tripsData.filter(trip => trip.status === 'pending');
    const approvedTrips = tripsData.filter(trip => trip.status === 'approved');

    const sortTripsByDate = (tripA, tripB) => new Date(tripA.date) - new Date(tripB.date);
    pendingTrips.sort(sortTripsByDate);
    approvedTrips.sort(sortTripsByDate);

    // concatenate the sorted arrays: pending trips first, then approved trips
    const sortedTrips = pendingTrips.concat(approvedTrips);

    // Iterate over the sorted and concatenated trips to display them
    sortedTrips.forEach(trip => {
        const destination = destinationsData.find(dest => dest.id === trip.destinationID);
        const tripInfo = document.createElement('div');
        tripInfo.classList.add('trip');
        tripInfo.innerHTML = `
            <h3>${destination ? destination.destination : 'Unknown Destination'} (Trip Booking ID: ${trip.id})</h3>
            <p>Date: ${trip.date}, Duration: ${trip.duration} days, Status: ${trip.status}</p>
        `;
        tripsContainer.appendChild(tripInfo);
    });
}

function displayLoginError() {
    // Logic to display login error message wip
}

function displayTotalSpentPerYear(totalSpentPerYear) {
    const totalSpentContainer = document.getElementById('total-spent-container'); // Ensure this element exists in your HTML
    totalSpentContainer.innerHTML = ''; // Clear previous content

    // create and append elements for each year's total
    Object.keys(totalSpentPerYear).forEach(year => {
        const yearTotal = document.createElement('p');
        yearTotal.textContent = `Total spent in ${year}: $${totalSpentPerYear[year].toFixed(2)}`;
        totalSpentContainer.appendChild(yearTotal);
    });
}

// Exports
export { displayTravelerDashboard, displayTravelerInfo, displayTrips, displayLoginError, displayTotalSpentPerYear };