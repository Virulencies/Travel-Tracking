import chai from 'chai';
const expect = chai.expect;

const { users, sampleTripsData, sampleDestinationsData } = require('./testData');
const { validateCredentials } = require('./credentialsTest');
const { calculateTotalSpentPerYear } = require('./calculateTotalSpent-test');
const { categorizeTrips } = require('./categorizeTrips-test')

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

    const expectedTotalSpent2022 = 2321;
    const expectedTotalSpent2023 = 3894;

    expect(result['2022']).to.equal(expectedTotalSpent2022);
    expect(result['2023']).to.equal(expectedTotalSpent2023);
  });
});  

describe('categorizeTrips function', function () {
  it('should correctly categorize trips into pending and approved based on status', function () {
      const categorizedTrips = categorizeTrips(sampleTripsData.trips);

      const expectedPendingTripsCount = 2; 
      const expectedApprovedTripsCount = 3;

      expect(categorizedTrips.pending.length).to.equal(expectedPendingTripsCount, "Pending trips do not match the expected value.");
      expect(categorizedTrips.approved.length).to.equal(expectedApprovedTripsCount, "Approved trips do not match the expected value.");

      const expectedPendingTripIds = [4, 5];
      const expectedApprovedTripIds = [1, 2, 3];
      const actualPendingTripIds = categorizedTrips.pending.map(trip => trip.id);
      const actualApprovedTripIds = categorizedTrips.approved.map(trip => trip.id);

      expect(actualPendingTripIds).to.deep.equal(expectedPendingTripIds, "The IDs of pending trips do not match the expected values.");
      expect(actualApprovedTripIds).to.deep.equal(expectedApprovedTripIds, "The IDs of approved trips do not match the expected values.");
  });
});