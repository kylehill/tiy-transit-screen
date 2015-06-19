var express = require('express');
var path = require('path');

var request = require("request")

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.get("/", function(req, res){
  res.sendFile(path.join(__dirname, 'public/test.html'))
})

app.get("/data", function(req, res){

  var latitude = req.query.latitude
  var longitude = req.query.longitude
  var url = "https://iron-rail.herokuapp.com/v1?latitude=" + latitude + "&longitude=" + longitude

  console.log("Proxying request to ", url)

  request({
    url: url,
    json: true
  }, function(err, response, body){
    res.json(body)
  })

})

module.exports = app;
