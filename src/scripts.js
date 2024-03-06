// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

//Imports
import './css/styles.scss';
import './images/turing-logo.png'
import { fetchTravelerData, fetchTripsData, fetchDestinationsData, submitTripRequest } from './apiCalls.js';
import { displayTravelerDashboard, displayTrips, displayTotalSpentPerYear, displayAddedTrip, populateDestinations } from './domUpdates.js'

console.log('This is the JavaScript entry file - your code begins here.');

//Globals

let loginForm, usernameInput, passwordInput, loginSection, dashboardSection;
let tripRequestForm, durationInput, travelersInput, destinationSelect, dateInput;
let currentLastId = 0;
let destinationsData = [];
let costDisplay = document.getElementById('estimated-cost');



//Login handler
document.addEventListener('DOMContentLoaded', () => {
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
        const userId = parseInt(username.replace('traveler', ''));

        if (validateCredentials(username, password)) {
            fetchTravelerData(userId).then(travelerData => {
                displayTravelerDashboard(travelerData);
                return Promise.all([fetchTripsData(), fetchDestinationsData()]);
            })
                .then(([tripsData, destinationsData]) => {
                    const userTrips = tripsData.trips.filter(trip => trip.userID === userId);
                    displayTrips(userTrips, destinationsData);

                    const totalSpentPerYear = calculateTotalSpentPerYear(userTrips, destinationsData);
                    displayTotalSpentPerYear(totalSpentPerYear);

                    populateDestinations(destinationsData, destinationSelect);
                })
                .catch(error => {
                    console.error('Error:', error);
                });

            loginSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            document.getElementById('main-nav').classList.remove('hidden');

        } else {
            alert('Invalid Username or Password. Please try again.');
        }
    });

    [dateInput, durationInput, travelersInput, destinationSelect].forEach(field => {
        field.addEventListener('input', updateEstimatedCost);
    });



    tripRequestForm.addEventListener('input', () => {
        const selectedDestination = destinationsData.find(dest => dest.id === parseInt(destinationSelect.value));
        const duration = parseInt(durationInput.value) || 0;
        const travelers = parseInt(travelersInput.value) || 0;

        if (selectedDestination && duration > 0 && travelers > 0) {
            const costPerPerson = selectedDestination.estimatedFlightCostPerPerson + (selectedDestination.estimatedLodgingCostPerDay * duration);
            const totalCost = costPerPerson * travelers;
            const totalCostWithFee = totalCost * 1.1;

            if (costDisplay) {
                costDisplay.textContent = `Estimated Cost: $${totalCostWithFee.toFixed(2)}`;
            } else {
                console.error('Estimated cost display element not found');
            }
        } else {
            if (costDisplay) {
                costDisplay.textContent = "Estimated Cost: $0.00";
            }
        }
    });

});

//Other ELs
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#main-nav button').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);

            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});

document.getElementById('logout-button').addEventListener('click', () => {

    window.location.reload();
});


document.getElementById('trip-request-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const userID = parseInt(document.getElementById('username').value.replace('traveler', ''));
    const destinationID = parseInt(destinationSelect.value);
    const travelers = parseInt(travelersInput.value);
    const date = document.getElementById('trip-date').value.replace(/-/g, '/');
    const duration = parseInt(durationInput.value);
    const suggestedActivities = [];
    const destinationName = destinationSelect.options[destinationSelect.selectedIndex].text;


    currentLastId += 1;

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
                destinationName,
            };

            displayAddedTrip(completeTrip, "Trip added! An agent will review your plan soon!");
            tripRequestForm.reset();
        })
        .catch(error => {
            console.error('Error submitting trip request:', error);
        });

});

//Logic
function validateCredentials(username, password) {
    const isPasswordCorrect = password === 'travel';

    const userId = parseInt(username.replace('traveler', ''));
    const isUsernameValid = username.startsWith('traveler') && !isNaN(userId) && userId > 0;

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


function updateEstimatedCost() {
    let selectedOption = destinationSelect.options[destinationSelect.selectedIndex];
    console.log('Selected Option:', selectedOption);

    if (!selectedOption) {
        console.log('No option selected, exiting updateEstimatedCost');
        return;
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
    let totalCost = (totalFlightCost + totalLodgingCost) * 1.1;
    console.log('Total Flight Cost:', totalFlightCost.toFixed(2));
    console.log('Total Lodging Cost:', totalLodgingCost.toFixed(2));
    console.log('Total Cost (Including 10% Fee):', totalCost.toFixed(2));

    costDisplay.textContent = `Estimated Cost: $${totalCost.toFixed(2)}`;
}

