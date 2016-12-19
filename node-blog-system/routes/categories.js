var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next) {
	res.render('addcategory',{
			'title': 'Add category'
	});
});

router.post('/add', function(req, res, next) {
  // Get Form Values
  var name = req.body.name;
 


  	// Form Validation
	req.checkBody('name','Title field is required').notEmpty();

	// Check Errors
	var errors = req.validationErrors();

	if(errors){
		res.render('addcategory',{
			"errors": errors
		});
	} else {
		var categories = db.get('categories');
		categories.insert({
			"name": name,
		}, function(err, post){
			if(err){
				res.send(err);
			} else {
				req.flash('success','category Added');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;