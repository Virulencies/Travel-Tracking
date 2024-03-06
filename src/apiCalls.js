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

function fetchDestinationsData() {
    return fetch('http://localhost:3001/api/v1/destinations')
        .then(response => response.json())
        .then(data => data.destinations)
        .catch(error => console.error('Error fetching destinations data:', error));

        
}

function submitTripRequest(tripRequest) {
    console.log('Trip request data:', tripRequest);

    return fetch('http://localhost:3001/api/v1/trips', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripRequest)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
        }
        return response.json();
    });
}

export { fetchTravelerData, fetchTripsData, fetchDestinationsData, submitTripRequest };