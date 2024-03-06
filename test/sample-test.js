import chai from 'chai';
const expect = chai.expect;

const { users, sampleTripsData, sampleDestinationsData } = require('./testData');
const { validateCredentials } = require('./credentialsTest');
const { calculateTotalSpentPerYear } = require('./calculateTotalSpent-test');

calculateTotalSpentPerYear

describe('See if the tests are running', function () {
  it('should return true', function () {
    expect(true).to.equal(true);
  });
});


describe('validateCredentials', function () {
  it('should return true for valid username and password', function () {
    const result = validateCredentials("traveler1", "travel");
    expect(result).to.be.true;
  });

  it('should return false for invalid username', function () {
    const result = validateCredentials("invalidUser", "travel");
    expect(result).to.be.false;
  });

  it('should return false for invalid password', function () {
    const result = validateCredentials("traveler1", "wrongpassword");
    expect(result).to.be.false;
  });
});

describe('calculateTotalSpentPerYear function', function () {
  it('should calculate total spent per year correctly with multiple entries', function () {
    const result = calculateTotalSpentPerYear(sampleTripsData, sampleDestinationsData);

    const expectedTotalSpent2022 = 2046;
    const expectedTotalSpent2023 = 4818;

    expect(result['2022']).to.equal(expectedTotalSpent2022);
    expect(result['2023']).to.equal(expectedTotalSpent2023);
  });
});