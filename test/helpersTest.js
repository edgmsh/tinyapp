const { assert } = require('chai');
const { getUserByEmail } = require('../helpers.js');
const { urlsForUser } = require('../helpers.js');

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

describe('urlsForUser', function() {
  it('should return urls that belong to the specified user', function() {
    // Define test data
    const urlDatabase = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "user1" },
      "9sm5xK": { longURL: "http://www.google.com", userID: "user2" },
      "a1b2c3": { longURL: "http://www.example.com", userID: "user1" }
    };
    // Define expected output
    const expectedOutput = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "user1" },
      "a1b2c3": { longURL: "http://www.example.com", userID: "user1" }
    };

    // Call the function with userID 'user1'
    const result = urlsForUser(urlDatabase,'user1');

    // Assert that the result matches the expected output
    assert.deepEqual(result, expectedOutput);
  });
  it('should not return urls that belong to the specified user', function() {
    // Define test data
    const urlDatabase = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "user1" },
      "9sm5xK": { longURL: "http://www.google.com", userID: "user2" },
      "a1b2c3": { longURL: "http://www.example.com", userID: "user1" }
    };
    // Define expected output
    const expectedOutput = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "user1" },
      "a1b2c3": { longURL: "http://www.example.com", userID: "user1" }
    };

    // Call the function with userId 'user1'
    const result = urlsForUser(urlDatabase,'user5');

    // Assert that the result matches the expected output
    assert.deepEqual(result, {});
  });
});
