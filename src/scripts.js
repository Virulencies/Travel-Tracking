// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'
import { fetchTravelerData, fetchTripsData } from './apiCalls.js';
import { displayTravelerDashboard, displayTravelerInfo, displayTrips, displayLoginError } from './domUpdates.js'

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

        // Proceed with validation
        if (validateCredentials(username, password)) {
            fetchTravelerData(userId).then(travelerData => {
                displayTravelerDashboard(travelerData);
                return fetchTripsData(userId);
            })
            .then(tripsData => {
                displayTrips(tripsData);
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

//Fetch the data

/*fetchTravelerData(userId)
    .then(travelerData => {
        displayTravelerDashboard(travelerData);
        return fetchTripsData(userId); // Assuming you will modify fetchTripsData to take and use travelerId
    })
    .then(allTripsData => {
        const travelerTrips = allTripsData.trips.filter(trip => trip.userID === userId);
        displayTrips(travelerTrips);
    })
    .catch(error => {
        console.error('Error:', error);
        displayLoginError();
    });

    */