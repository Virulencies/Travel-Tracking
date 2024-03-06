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

module.exports = { validateCredentials };
