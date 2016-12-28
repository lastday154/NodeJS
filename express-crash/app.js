var express = require("express");
var bodyParser = require('body-parser');
var path = require("path");
var expressValidator = require('express-validator');
var mongojs = require("mongojs");
var db = mongojs("customerapp", ['users']);
var ObjectId = mongojs.ObjectId;

var app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));


// Global vars
app.use(function(req, res, next) {
	res.locals.errors = null;
	next();
})

// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.get('/', function(req, res) {
	db.users.find(function(err, docs) {
			console.log(docs);
			res.render('index', {
			title: 'Customers App',
			users: docs
		});
	})
});

app.post('/users/add', function(req, res) {
	req.checkBody('first_name', 'First Name is Required').notEmpty();
	req.checkBody('last_name', 'Last Name is Required').notEmpty();
	req.checkBody('email', 'Email is Required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render('index', {
			title: 'Customers App',
			users: users,
			errors: errors
		});
	} else {
		var newUser = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email
		}	
		db.users.insert(newUser, function(errors, result) {
			if (errors) {
				console.log(err)
			}
			res.redirect('/');
		});
	}
	
});

app.delete('/users/delete/:id', function(req, res) {
	db.users.remove({_id: ObjectId(req.params.id)}, function(err) {
		if (err) {
			console.log(err);
		}

		res.redirect('/');
	})
})
app.listen(3000, function () {
	console.log('Server started on port 3000 ...');
});