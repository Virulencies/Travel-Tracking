function fetchTravelerData(travelerId) {
    return fetch(`http://localhost:3001/api/v1/travelers/${travelerId}`)
        .then(response => response.json())
        .catch(error => console.error('Error fetching traveler info:', error));
}

function fetchTripsData(travelerId) {
    return fetch('http://localhost:3001/api/v1/trips')
        .then(response => response.json())
        .catch(error => console.error('Error fetching trips data:', error));
}

export { fetchTravelerData, fetchTripsData };