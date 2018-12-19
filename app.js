var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 3000;

app.use(express.static(__dirname+"/public"));

/**
 * To support JSON-encoded bodies.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send("/public/index.html");
})

app.get('/data', (req, res) => {
    res.send("hello");
})



app.listen(port);
console.log("Server Running Successfully at port " + port);

module.exports = app