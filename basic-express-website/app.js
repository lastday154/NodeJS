var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/',(req, res)=> {
	res.send('<h1> Hello, Steve </h1>');
});
app.listen(3000);
console.log('Server is running on port 3000 ....');