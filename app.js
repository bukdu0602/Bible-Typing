const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
res.sendfile(__dirname + "\\public\\index.html")

})

app.listen(3000, () => {
  console.log("port started on 3000")
})
