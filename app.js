const express = require('express');
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "DlashgusDlashgus1011",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB', {
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


// Get Get Get Get Get Get Get Get Get Get Get Get Get Get Get Get Get Get Get Get


app.get("/", (req, res) => {
  res.render("index")
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
        res.render("chaptersSaved", {chaptersSaved: user.chapter, verseSaved: user.verse})
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
res.send("Saved!!!")
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
            res.render("chaptersSaved", {chaptersSaved: user.chapter, verseSaved: user.verse})
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
      passport.authenticate("local")(req, res, function() {
        User.updateOne({username: req.body.username}, {name: req.body.name}, function(err){
          if (err) {
            console.log(err);
          } else {
            console.log("successfully name")
          }
        })
        res.render("chaptersSaved", {chaptersSaved: null, verseSaved: null });
      });
    }
  });
} else {
  res.send("password does not match")
}
});


app.listen(3000, () => {
  console.log("port started on 3000")
});
