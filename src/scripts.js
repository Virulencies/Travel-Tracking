// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'
import { fetchTravelerData, fetchTripsData, fetchDestinationsData } from './apiCalls.js';
import { displayTravelerDashboard, displayTravelerInfo, displayTrips, displayLoginError, displayTotalSpentPerYear } from './domUpdates.js'

console.log('This is the JavaScript entry file - your code begins here.');

//Globals
//const userId = parseInt(username.replace('traveler', ''));


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
                // Filter the trips to only include those for the logged-in user
                const userTrips = tripsData.trips.filter(trip => trip.userID === userId);
                // Now pass both user-specific trips and destinations data to displayTrips
                displayTrips(userTrips, destinationsData);

                const totalSpentPerYear = calculateTotalSpentPerYear(userTrips, destinationsData);
                displayTotalSpentPerYear(totalSpentPerYear);
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
    // Check if the password is correct
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
            // Calculate the cost of the current trip
            const tripCost = (destination.estimatedLodgingCostPerDay * trip.duration + destination.estimatedFlightCostPerPerson * trip.travelers) * 1.1; // Including 10% agent fee
            
            // Extract the year from the trip date
            const year = new Date(trip.date).getFullYear();
            
            // Initialize the year in totalSpentPerYear if it doesn't exist
            if (!totalSpentPerYear[year]) {
                totalSpentPerYear[year] = 0;
            }
            
            // Add the cost of the current trip to the total for the year
            totalSpentPerYear[year] += tripCost;
        }
    });

    return totalSpentPerYear;
}