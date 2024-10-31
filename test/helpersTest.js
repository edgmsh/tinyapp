const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "[email protected1]", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "[email protected2]", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers,"[email protected1]")
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID);
  });
  it('should not return a user with valid email', function() {
    const user = getUserByEmail(testUsers,"[email protected3]")
    const expectedUser = null;
    assert.equal(user, expectedUser);
  });
  it('should not return a user with valid email', function() {
    const user = getUserByEmail(testUsers,"")
    const expectedUser = null;
    assert.equal(user, expectedUser);
  });
  it('should not return a user with valid email', function() {
    const user = getUserByEmail(testUsers,undefined)
    const expectedUser = null;
    assert.equal(user, expectedUser);
  });
  it('should not return a user with valid email', function() {
    const user = getUserByEmail(testUsers,null)
    const expectedUser = null;
    assert.equal(user, expectedUser);
  });
});
