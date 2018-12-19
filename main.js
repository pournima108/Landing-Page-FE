var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var request = require('request')

var port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/data',(req,res)=>{
    var parameter ={
    method:"POST",
    url: "https://api.dialogflow.com/v1/query",
    qs: { v: '20150910' },
    headers: { 
        'cache-control': 'no-cache',
        authorization: 'Bearer '+'2f1667eb74634f249ebf236c6992e593',
        'content-type': 'application/json'
    },

    body: { 
        lang: 'en',
        query: 'hi',
        sessionId: 12345,

    },
    json: true ,
}
request(parameter,(err,response)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log(response.body)
    }
})

  
});
app.listen(port);
console.log("Server Running Successfully at port " + port);

module.exports = app