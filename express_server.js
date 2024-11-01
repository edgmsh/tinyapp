const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const { generateRandomId, getUserByEmail, urlsForUser } = require("./helpers");

const app = express();
const PORT = 8080; 

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1','key2'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

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

app.post("/urls", (req, res) => {
  if (Object.keys(req.body).includes('longURL') && req.body['longURL']) {
    let user = req.session.user_id;
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
    if (!req.session.user_id) {
      return res.status(400).send('To delete URLs, please, login.');
    }
    user = req.session.user_id;
    if (user.id !== urlDatabase[req.params.id].userID) {
      return res.status(400).send('You only can delete your URLs.');
    }
    delete urlDatabase[req.params.id];
    res.redirect(`/urls`);  
});

app.post("/urls/:id/update", (req, res) => {
  let user = false;
  let userDB = {};
  if (!req.session.user_id) {
    return res.status(400).send('To update URLs, please, login.');
  }
  user = req.session.user_id;
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
  if (!user) {
    return res.status(403).send('wrong credentials. please, try again.');
  }
  if (!bcrypt.compareSync(req.body['password'], user.password)) {
    return res.status(403).send('wrong password. please, try again.');
  }
  req.session.user_id = user;
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
  req.session.user_id = user;
  users[userID] = user;
  return res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/login`);
});

app.get("/urls/:id/updateMain", (req, res) => {
  res.redirect(`/urls/${req.params.id}`);
  
});

app.get("/u/:id", (req, res) => {
  if (!req.session.user_id) {
    return res.status(404).send('Please, login first.');
  }
  if (req.session.user_id.id !== urlDatabase[req.params.id]['userID']) {
    return res.status(404).send('You can only make changes to your URLs.');
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
  if (req.session.user_id) {
    user = req.session.user_id;
    userDB = urlsForUser(urlDatabase,user.id);
  } else {
    return res.status(400).send('To see your URLs, please, login.');
  }
  const templateVars = { user: user, urls: userDB};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let user = false;
  if (req.session.user_id) {
    user = req.session.user_id;
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
  if (req.session.user_id) {
    user = req.session.user_id;
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


