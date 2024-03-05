// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'
import { fetchTravelerData, fetchTripsData, fetchDestinationsData, submitTripRequest } from './apiCalls.js';
import { displayTravelerDashboard, displayTravelerInfo, displayTrips, displayLoginError, displayTotalSpentPerYear, displayAddedTrip, populateDestinations } from './domUpdates.js'

console.log('This is the JavaScript entry file - your code begins here.');

//Globals
//const userId = parseInt(username.replace('traveler', ''));
/*const tripRequestForm = document.getElementById('trip-request-form');
const durationInput = document.getElementById('duration');
const travelersInput = document.getElementById('travelers');
const destinationSelect = document.getElementById('destination-select');
const costDisplay = document.getElementById('estimated-cost');
const dateInput = document.getElementById('trip-date');
let currentLastId = 0;
let destinationsData = [];*/

let loginForm, usernameInput, passwordInput, loginSection, dashboardSection;
let tripRequestForm, durationInput, travelersInput, destinationSelect, dateInput; //costDisplay;
let currentLastId = 0;
let destinationsData = [];
let costDisplay = document.getElementById('estimated-cost');



//Login Section

document.addEventListener('DOMContentLoaded', () => {
    /*const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    //const tripRequestForm = document.getElementById('trip-request-form');
    const durationInput = document.getElementById('duration');
    const travelersInput = document.getElementById('travelers');
    const destinationSelect = document.getElementById('destination-select');
    //const costDisplay = document.getElementById('estimated-cost');
    const dateInput = document.getElementById('trip-date');
    //let currentLastId = 0;
    //let destinationsData = []; */

    loginForm = document.getElementById('login-form');
    usernameInput = document.getElementById('username');
    passwordInput = document.getElementById('password');
    loginSection = document.getElementById('login-section');
    dashboardSection = document.getElementById('dashboard-section');
    tripRequestForm = document.getElementById('trip-request-form');
    durationInput = document.getElementById('duration');
    travelersInput = document.getElementById('travelers');
    destinationSelect = document.getElementById('destination-select');
    costDisplay = document.getElementById('estimated-cost');
    dateInput = document.getElementById('trip-date');


    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;
        const userId = parseInt(username.replace('traveler', '')); // Extract user ID

        if (validateCredentials(username, password)) {
            fetchTravelerData(userId).then(travelerData => {
                displayTravelerDashboard(travelerData);
                // Fetch both trips and destinations data AFTER successful traveler data fetch
                return Promise.all([fetchTripsData(), fetchDestinationsData()]);
            })
            .then(([tripsData, destinationsData]) => {
                const userTrips = tripsData.trips.filter(trip => trip.userID === userId); // Make sure tripsData is structured correctly for filtering
                displayTrips(userTrips, destinationsData);

                const totalSpentPerYear = calculateTotalSpentPerYear(userTrips, destinationsData);
                displayTotalSpentPerYear(totalSpentPerYear);

                populateDestinations(destinationsData, destinationSelect);
            })
            .catch(error => {
                console.error('Error:', error);
                displayLoginError();
            });

            loginSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
        } else {
            alert('Invalid Username or Password. Please try again.');
        }
    });

    [dateInput, durationInput, travelersInput, destinationSelect].forEach(field => {
        field.addEventListener('input', updateEstimatedCost); // Use 'input' for instant feedback on change
    }); 

    

    tripRequestForm.addEventListener('input', () => {
        // ensure we have a selected destination and all other valid inputs in the required fields
        const selectedDestination = destinationsData.find(dest => dest.id === parseInt(destinationSelect.value));
        const duration = parseInt(durationInput.value) || 0;
        const travelers = parseInt(travelersInput.value) || 0;
    
        if (selectedDestination && duration > 0 && travelers > 0) {
            const costPerPerson = selectedDestination.estimatedFlightCostPerPerson + (selectedDestination.estimatedLodgingCostPerDay * duration);
            const totalCost = costPerPerson * travelers;
            const totalCostWithFee = totalCost * 1.1; // + 10% agent fee
    
            if (costDisplay) {
                costDisplay.textContent = `Estimated Cost: $${totalCostWithFee.toFixed(2)}`;
            } else {
                console.error('Estimated cost display element not found');
            }
        } else {
            // handle cases where input values are not valid for cost calculation
            if (costDisplay) {
                costDisplay.textContent = "Estimated Cost: $0.00";
            }
        }
    });



});

function validateCredentials(username, password) {
    const isPasswordCorrect = password === 'travel';

    //extract the user ID from the username and validate it
    const userId = parseInt(username.replace('traveler', ''));
    const isUsernameValid = username.startsWith('traveler') && !isNaN(userId) && userId > 0;

    //proceed if both username and password are valid
    if (isUsernameValid && isPasswordCorrect) {
       
        return true;
    } else {
        return false;
    }
}

function initializeCurrentLastId() {
    fetchTripsData()
        .then(tripsData => {
            const maxId = tripsData.trips.reduce((max, trip) => Math.max(max, trip.id), 0);
            currentLastId = maxId; 
        })
        .catch(error => console.error('Error fetching trips data:', error));
}

initializeCurrentLastId();

function calculateTotalSpentPerYear(tripsData, destinationsData) {
    let totalSpentPerYear = {};

    tripsData.forEach(trip => {
        const destination = destinationsData.find(dest => dest.id === trip.destinationID);
        if (destination) {
            // cost of the current trip
            const tripCost = (destination.estimatedLodgingCostPerDay * trip.duration + destination.estimatedFlightCostPerPerson * trip.travelers) * 1.1; // Including 10% agent fee
            
            // get the year from the trip date
            const year = new Date(trip.date).getFullYear();
            
            // initialize the year in totalSpentPerYear if it doesn't exist
            if (!totalSpentPerYear[year]) {
                totalSpentPerYear[year] = 0;
            }
            
            totalSpentPerYear[year] += tripCost;
        }
    });

    return totalSpentPerYear;
}

/*function populateDestinations(destinationsData) {
    const destinationSelect = document.getElementById('destination-select');
    destinationsData.forEach(destination => {
        const option = document.createElement('option');
        option.value = destination.id;
        option.textContent = destination.destination;
        destinationSelect.appendChild(option);
    });
} */ // moved to domupdates

function updateEstimatedCost() {
    let selectedOption = destinationSelect.options[destinationSelect.selectedIndex];
    console.log('Selected Option:', selectedOption); 

    if (!selectedOption) {
        console.log('No option selected, exiting updateEstimatedCost');
        return; // terminate fn if no option is selected
    }

    let estimatedFlightCostPerPerson = parseFloat(selectedOption.getAttribute('data-estimated-flight-cost-per-person'));
    let estimatedLodgingCostPerDay = parseFloat(selectedOption.getAttribute('data-estimated-lodging-cost-per-day'));
    console.log('Estimated Flight Cost Per Person:', estimatedFlightCostPerPerson);
    console.log('Estimated Lodging Cost Per Day:', estimatedLodgingCostPerDay);

    let travelers = parseInt(travelersInput.value, 10);
    let duration = parseInt(durationInput.value, 10);
    console.log('Travelers:', travelers);
    console.log('Duration:', duration);

    if (isNaN(estimatedFlightCostPerPerson) || isNaN(estimatedLodgingCostPerDay) || isNaN(travelers) || isNaN(duration)) {
        console.log('One or more inputs are NaN, resetting cost to $0.00');
        costDisplay.textContent = 'Estimated Cost: $0.00';
        return;
    }

    let totalFlightCost = estimatedFlightCostPerPerson * travelers;
    let totalLodgingCost = estimatedLodgingCostPerDay * duration * travelers;
    let totalCost = (totalFlightCost + totalLodgingCost) * 1.1; // Including 10% agent fee
    console.log('Total Flight Cost:', totalFlightCost.toFixed(2));
    console.log('Total Lodging Cost:', totalLodgingCost.toFixed(2));
    console.log('Total Cost (Including 10% Fee):', totalCost.toFixed(2));

    costDisplay.textContent = `Estimated Cost: $${totalCost.toFixed(2)}`;
}


/*tripRequestForm.addEventListener('input', () => {
    // ensure we have a selected destination and all other valid inputs in the required fields
    const selectedDestination = destinationsData.find(dest => dest.id === parseInt(destinationSelect.value));
    const duration = parseInt(durationInput.value) || 0;
    const travelers = parseInt(travelersInput.value) || 0;

    if (selectedDestination && duration > 0 && travelers > 0) {
        const costPerPerson = selectedDestination.estimatedFlightCostPerPerson + (selectedDestination.estimatedLodgingCostPerDay * duration);
        const totalCost = costPerPerson * travelers;
        const totalCostWithFee = totalCost * 1.1; // + 10% agent fee

        if (costDisplay) {
            costDisplay.textContent = `Estimated Cost: $${totalCostWithFee.toFixed(2)}`;
        } else {
            console.error('Estimated cost display element not found');
        }
    } else {
        // handle cases where input values are not valid for cost calculation
        if (costDisplay) {
            costDisplay.textContent = "Estimated Cost: $0.00";
        }
    }
}); */ //moved this into domcontentloaded el

document.getElementById('trip-request-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const userID = parseInt(document.getElementById('username').value.replace('traveler', ''));
    const destinationID = parseInt(destinationSelect.value);
    const travelers = parseInt(travelersInput.value);
    const date = document.getElementById('trip-date').value.replace(/-/g, '/');
    const duration = parseInt(durationInput.value);
    const suggestedActivities = [];
    const destinationName = destinationSelect.options[destinationSelect.selectedIndex].text; // Directly use the dropdown's selected text


    currentLastId += 1; 

    // Constructing the trip request object
    const tripRequest = {
        id: ++currentLastId,
        userID,
        destinationID,
        travelers,
        date,
        duration,
        status: 'pending',
        suggestedActivities
    };

    submitTripRequest(tripRequest)
    .then(response => {
        const completeTrip = {
            ...response.newTrip, 
            destinationName, // use the name directly obtained from the dropdown since I keep returning undefined
        };

        displayAddedTrip(completeTrip, "Trip added! An agent will review your plan soon!");
        tripRequestForm.reset(); // reset the form here
    })
    .catch(error => {
        console.error('Error submitting trip request:', error);
        // add logic to handle the error, such as displaying a message to the user
    });

});