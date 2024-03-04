

function displayTravelerDashboard(travelerData) {
    const travelerNameEl = document.getElementById('traveler-name');
    travelerNameEl.textContent = `Welcome, ${travelerData.name}`;

    // Extend this to display more info as needed
}

function displayTravelerInfo(travelerData) {
    // Logic to display traveler information
}

function displayTrips(tripsData) {
    // Logic to display trips wip
}

function displayLoginError() {
    // Logic to display login error message wip
}

// Exports
export { displayTravelerDashboard, displayTravelerInfo, displayTrips, displayLoginError };