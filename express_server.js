const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const generateRandomString = function() {
  let rString = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 6; i > 0; --i)
    result += rString[Math.floor(Math.random() * rString.length)];
  return result;
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post("/urls", (req, res) => {
  if (Object.keys(req.body).includes('longURL') && req.body['longURL']) {
    let shortURL = generateRandomString();
    urlDatabase[shortURL] = req.body['longURL'];
    res.redirect(`/urls/${shortURL}`);
  }
});

app.post("/urls/:id/delete", (req, res) => {
    delete urlDatabase[req.params.id];
    res.redirect(`/urls`);
    
});

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body['longURL'];
  res.redirect(`/urls`);
  
});

app.post("/login", (req, res) => {
  if (!req.body['user']) {
    return res.status(400).send('you must provide a user to proceed.');
  } else {
  res.cookie('user_id',req.body['user']);
  return res.redirect(`/urls`);
  }
});

app.post("/register", (req, res) => {
  if (!req.body['email'] || !req.body['password']) {
    return res.status(400).send('you must provide an email and password to proceed.');
  } else {  
  let userID = generateRandomString();
  res.cookie('user_id',req.body['email']);
  users[userID] = {id: userID, email: req.body['email'],password: req.body['password']};
  console.log(users);
  return res.redirect(`/urls`);
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect(`/urls`);
});

app.get("/urls/:id/updateMain", (req, res) => {
  res.redirect(`/urls/${req.params.id}`);
  
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.send("Hello!");
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
  if (req.cookies["user_id"]) {
    user = req.cookies["user_id"];
  }
  const templateVars = { user: user, urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {user: req.cookies["user_id"]};
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
 // const templateVars = {user: false};
  res.render("register");
});

app.get("/urls/:id", (req, res) => {
  let user = false;
  if (req.cookies["user_id"]) {
    user = req.cookies["user_id"];
  }
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: user};
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});