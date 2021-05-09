const express = require('express');
const bodyParser = require("body-parser");
const request = require("request");
const bible = require("./bible");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

// console.log(bible.hello())
// 파일 경로 퍼블릭으로 변경하기

app.get("/", (req, res) => {
  res.sendFile(__dirname + "\\index.html")
})

app.get("/index", (req, res) => {
  res.sendFile(__dirname + "\\index.html")
})
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "\\login.html")
})
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "\\signup.html")
})
app.get("/chapters", (req, res) => {
  res.sendFile(__dirname + "\\chapters.html")
})
app.get("/type", (req, res) => {
  res.sendFile(__dirname + "\\type.html")
})
// Post Post Post------------------------------------

app.post("/", (req, res) => {
  res.send("thanks for posting " + req.body.chapterName + " " + req.body.verseNumber)
  console.log(req.body.chapterName)
  console.log(req.body.verseNumber)
  // res.redirect("/")
})



app.listen(3000, () => {
  console.log("port started on 3000")
})
