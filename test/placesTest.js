const { assert } = require('chai');
const { places, addPlace } = require('../src/places');

describe('place', () => {

  it('can add a place', () => {
    addPlace('Nairobi', 'Kenya');
    assert.equal(places.length, 1);
    assert.equal(places[0].id, 1);
    assert.equal(places[0].city, 'Nairobi');
    assert.equal(places[0].country, 'Kenya');
    assert.equal(places[0].numType, 'odd');
  });

  it('can add two places', () => {
    addPlace('Cape Town', 'South Africa');
    addPlace('Victoria', 'Australia');
    assert.equal(places.length, 2);
    assert.equal(places[1].id, 2);
    assert.equal(places[1].city, 'Victoria');
    assert.equal(places[1].country, 'Australia');
    assert.equal(places[1].numType, 'even');
  });
});
