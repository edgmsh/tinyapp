
const generateRandomId = function() {
  const id = Math.random().toString(36).substring(2, 8); // generate a random 6 char string
  return id;
};

const getUserByEmail = function(users,email) {
  for (let key in users) {
    if (users[key].email === email) {
      return users[key]; 
    }
  }
  return null;
}; 

const urlsForUser = function(urlDB, userId) {
  let userUrls = {};
    for (let key in urlDB) {
      if (urlDB[key].userID === userId) {
        userUrls[key] = urlDB[key];
      }
    }
   return userUrls; 
  };

  module.exports = { generateRandomId, getUserByEmail, urlsForUser };