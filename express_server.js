const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 8080; 

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "user2RandomID",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2a$10$LPVe/xMaFyq5etKqtp1oaeIml6BbjGZir4Wy46xmMQu0S.TLsWrjW", // "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2a$10$zXJ/rqZI/4Z/FbP2fmGjbug.FZuPSuDRzjUI1Id2KnXLwHXpHJR6m", // "dishwasher-funk"
  },
};

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

app.post("/urls", (req, res) => {
  if (Object.keys(req.body).includes('longURL') && req.body['longURL']) {
    let user = req.cookies["user_id"];
    if (!user) {
      return res.redirect(`/login`);
    }
    let shortURL = generateRandomId();
    urlDatabase[shortURL] = {longURL: req.body['longURL'], userID: user.id};
    res.redirect(`/urls/${shortURL}`);
  }
});

app.post("/urls/:id/delete", (req, res) => {
    let user = false;
    let userDB = {};
    if (!req.cookies["user_id"]) {
      return res.status(400).send('To delete URLs, please, login.');
    }
    user = req.cookies["user_id"];
    if (user.id !== urlDatabase[req.params.id].userID) {
      return res.status(400).send('You only can delete your URLs.');
    }
    delete urlDatabase[req.params.id];
    res.redirect(`/urls`);  
});

app.post("/urls/:id/update", (req, res) => {
  let user = false;
  let userDB = {};
  if (!req.cookies["user_id"]) {
    return res.status(400).send('To update URLs, please, login.');
  }
  user = req.cookies["user_id"];
  if (user.id !== urlDatabase[req.params.id].userID) {
    return res.status(400).send('You only can update your URLs.');
  }
  urlDatabase[req.params.id].longURL = req.body['longURL'];
  res.redirect(`/urls`);  
});

app.post("/login", (req, res) => {
  if (!req.body['email'] || !req.body['password']) {
    return res.status(400).send('you must provide a user to proceed.');
  } 
  let user = getUserByEmail(users,req.body['email']);
  if (user === null) {
    return res.status(403).send('wrong credentials. please, try again.');
  }
  if (!bcrypt.compareSync(req.body['password'], user.password)) {
    return res.status(403).send('wrong password. please, try again.');
  }
  res.cookie('user_id',user);
  return res.redirect(`/urls`);
});

app.post("/register", (req, res) => {
  if (!req.body['email'] || !req.body['password']) {
    return res.status(400).send('you must provide an email and password to proceed.');
  } 
  if (getUserByEmail(users,req.body['email'])) {
    return res.status(400).send('this email already exists. Pick another one.');
  }
  let userID = generateRandomId();
  let user = {id: userID, email: req.body['email'], password: bcrypt.hashSync(req.body['password'], 10)};
  res.cookie('user_id', user);
  users[userID] = user;
  return res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect(`/login`);
});

app.get("/urls/:id/updateMain", (req, res) => {
  res.redirect(`/urls/${req.params.id}`);
  
});

app.get("/u/:id", (req, res) => {
  if (!req.cookies["user_id"]) {
    return res.status(404).send('Please, login first.');
  }
  if (req.cookies["user_id"] !== urlDatabase[req.params.id].userID) {
    return res.status(404).send('You dan only make changes to your URLs.');
  }
  if (!urlDatabase[req.params.id]) {
    return res.status(404).send('This page cannot be found.');
  }
  const longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.redirect(`/urls`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls", (req, res) => {
  let user = false;
  let userDB = {};
  if (req.cookies["user_id"]) {
    user = req.cookies["user_id"];
    userDB = urlsForUser(urlDatabase,user.id);
  } else {
    return res.status(400).send('To see your URLs, please, login.');
  }
  const templateVars = { user: user, urls: userDB};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let user = false;
  if (req.cookies["user_id"]) {
    user = req.cookies["user_id"];
  } else {
    return res.redirect(`/login`);
  }
  const templateVars = {user: user};
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/urls/:id", (req, res) => {
  let user = false;
  if (req.cookies["user_id"]) {
    user = req.cookies["user_id"];
    if (user.id !== urlDatabase[req.params.id].userID) {
      return res.status(404).send('This URL does not belong to you.');
    }
  } else {
    return res.status(400).send('To see your URLs, please, login.');
  }
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: user};
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


