
const generateRandomId = function() {
  const id = Math.random().toString(36).substring(2, 8); // generate a random 6 char string
  return id;
};

const getUserByEmail = function(users,email) {
  let result = false;
  for (let key in users) {
    if (users[key].email === email) {
      result = users[key];
    }
  }
  return result;
}; 

const urlsForUser = function(urlDB, userId) {
  let userDB = {};
    for (let key in urlDB) {
      if (urlDB[key].userID === userId) {
        userDB[key] = urlDB[key];
      }
    }
   return userDB; 
  };

  module.exports = { generateRandomId, getUserByEmail, urlsForUser };