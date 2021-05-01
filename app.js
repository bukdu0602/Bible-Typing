const express = require('express');
const bodyParser = require("body-parser");

const app = express();
// 파일 경로 퍼블릭으로 변경하기
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
res.sendfile(__dirname + "\\public\\index.html")

})

app.listen(3000, () => {
  console.log("port started on 3000")
})
