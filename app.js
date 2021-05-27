require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const alert = require("alert");

const app = express();


app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: process.env.SECRET_CODE,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb+srv://Ryan-Lim:' + process.env.MONGO_PASSWORD + '@daily-journal.iq88u.mongodb.net/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  chapter: String,
  verse: Number
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

let userEmail = ""

// Get Get Get Get Get Get Get Get Get Get Get Get Get Get Get Get Get Get Get Get Get

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne({ username: userEmail }, function (err, user) {
      if (err){
        console.log(err)
      } else {
        // res.render("header", {aaa: "", bbb: ""})
        console.log(user.name)
        res.render("index", {userName: "welcome " + user.name})
      }
    });
  } else {
    res.render("index", {userName: ""})
  }
});

app.get("/login", (req, res) => {
  res.render("login")
});

app.get("/signup", (req, res) => {
  res.render("signup")
});

app.get("/logout", (req, res) => {
req.logout();
res.redirect("/");
});

app.get("/chapters", (req, res) => {
  if (req.isAuthenticated()) {
    User.findOne({ username: userEmail }, function (err, user) {
      if (err){
        console.log(err)
      } else {
        // res.render("header", {aaa: "", bbb: ""})
        res.render("chaptersSaved", {chaptersSaved: user.chapter, verseSaved: user.verse, userName: "welcome " + user.name})
      }
    });
  } else {
    res.render("chapters")
  }
});

// Post Post Post------------------------------------

app.post("/", (req, res) => {
User.updateOne({username: userEmail}, {chapter: req.body.chapterName}, function(err){
  if (err) {
    console.log(err);
  } else {
    console.log("successfully uploaded")
  }
})
User.updateOne({username: userEmail}, {verse: req.body.verseNumber}, function(err){
  if (err) {
    console.log(err);
  } else {
    console.log("successfully uploaded")
  }
})
res.render("Saved")
});


app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
userEmail = req.body.username;

  req.login(user, function(err){
    if(err) {
      console.log(err);
    } else {
      console.log(userEmail)
      passport.authenticate("local")(req, res, function() {
        User.findOne({ username: userEmail }, function (err, user) {
          if (err){
            console.log(err)
          } else {
            res.render("chaptersSaved", {chaptersSaved: user.chapter, verseSaved: user.verse, userName: "welcome " + user.name})
          }
        });

  });
}
});
});


app.post("/signup", (req, res) => {
  if(req.body.password === req.body.cfPassword){
  User.register({username: req.body.username}, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/signup");
    } else {
      User.updateOne({username: req.body.username}, {name: req.body.name}, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("successfully name")
        }
      });
      passport.authenticate("local")(req, res, function() {
      res.render("loginAgain")
  });
    }
  });
} else {
  res.send("password does not match")
}
});

app.post("/loginAgain", (req, res) => {
  req.logout();
  res.redirect("/login");
})


// process.env.PORT
app.listen(process.env.PORT, () => {
  console.log("port started successfully")
});
