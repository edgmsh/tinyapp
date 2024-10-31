
const generateRandomId = function() {
  return Math.random().toString(36).substring(2, 8); // generate a random 6 char string
};

const getUserByEmail = function(users,email) {
  for (let key in users) {
    if (users[key].email === email) {
      return users[key]; 
    }
  }
  return null;
}; 

const urlsForUser = function(userDB, userId) {

  let userUrls = {};
  for (const key in userDB) {
    if (userDB.hasOwnProperty(key)) {
      if (userDB[key].userId === userId) {
       userUrls[key] = userDB[key];
      }
    }
  }
  return userUrls; 
};

  module.exports = { generateRandomId, getUserByEmail, urlsForUser };