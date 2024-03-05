// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'
import { fetchTravelerData, fetchTripsData, fetchDestinationsData, submitTripRequest } from './apiCalls.js';
import { displayTravelerDashboard, displayTravelerInfo, displayTrips, displayLoginError, displayTotalSpentPerYear } from './domUpdates.js'

console.log('This is the JavaScript entry file - your code begins here.');

//Globals
//const userId = parseInt(username.replace('traveler', ''));
const tripRequestForm = document.getElementById('trip-request-form');
const durationInput = document.getElementById('duration');
const travelersInput = document.getElementById('travelers');
const destinationSelect = document.getElementById('destination-select');
const costDisplay = document.getElementById('cost-display');
let currentLastId = 203;
let destinationsData = [];


//Login Section

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');

    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;
        const userId = parseInt(username.replace('traveler', '')); // Extract user ID

        if (validateCredentials(username, password)) {
            // Fetch the traveler's data
            fetchTravelerData(userId).then(travelerData => {
                displayTravelerDashboard(travelerData);
                // Fetch both trips and destinations data after successful traveler data fetch
                return Promise.all([fetchTripsData(), fetchDestinationsData()]);
            })
            .then(([tripsData, destinationsData]) => {
                // Use destinationsData directly here, no need to reassign
                const userTrips = tripsData.trips.filter(trip => trip.userID === userId); // Make sure tripsData is structured correctly for filtering
                displayTrips(userTrips, destinationsData);

                const totalSpentPerYear = calculateTotalSpentPerYear(userTrips, destinationsData);
                displayTotalSpentPerYear(totalSpentPerYear);

                populateDestinations(destinationsData);
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

function populateDestinations(destinationsData) {
    const destinationSelect = document.getElementById('destination-select');
    destinationsData.forEach(destination => {
        const option = document.createElement('option');
        option.value = destination.id;
        option.textContent = destination.destination;
        destinationSelect.appendChild(option);
    });
}

tripRequestForm.addEventListener('input', () => {
    // ensure we have a selected destination and all other valid inputs in the required fields
    const selectedDestination = destinationsData.find(dest => dest.id === parseInt(destinationSelect.value));
    const duration = parseInt(durationInput.value) || 0;
    const travelers = parseInt(travelersInput.value) || 0;

    if (selectedDestination && duration > 0 && travelers > 0) {
        const costPerPerson = selectedDestination.estimatedFlightCostPerPerson + (selectedDestination.estimatedLodgingCostPerDay * duration);
        const totalCost = costPerPerson * travelers;
        const totalCostWithFee = totalCost * 1.1; // + 10% agent fee

        // need to check if costDisplay element even exists before attempting to update it apparently
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

document.getElementById('trip-request-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const userID = parseInt(document.getElementById('username').value.replace('traveler', ''));
    const destinationID = parseInt(document.getElementById('destination-select').value);
    const travelers = parseInt(document.getElementById('travelers').value);
    const date = document.getElementById('trip-date').value.replace(/-/g, '/');
    const duration = parseInt(document.getElementById('duration').value);
    const suggestedActivities = [];

    currentLastId += 1;

    const tripRequest = {
        id: currentLastId,
        userID,
        destinationID,
        travelers,
        date,
        duration,
        status: 'pending',
        suggestedActivities
    };

    submitTripRequest(tripRequest);
});