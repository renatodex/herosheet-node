var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('hello world PORRA!!');
});

app.listen(1337);
console.log("CONECTOU NA BAGAÇA!!!")