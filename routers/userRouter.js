'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {User} = require('../models/userModel');

const router = express.Router();

// do I need this line of code?
const jsonParser = bodyParser.json();


router.use(bodyParser.json());

router.get('/', (req, res) => {
	return User.find()
	  .then(users => res.json(users.map(user => user.serialize())))
	  .catch(err => res.status(500).json({
	  	message: 'Internal server error'
	  }));
});

// Will need help with this as well.
router.get('/list', (req, res) => {
	// Not sure how to get the userId from the front end
	User.findById(id, function (err, doc) {
		//want to have code here that will allow me to
		//pull the list the user just posted and send
		//that data back as a json object. 
	})

	// User.lists.find()
	//     .limit(10)
	//     .then(lists => {
	// 		res.json(lists)
	//     })
	//     .catch(err => {
	//       console.error(err);
	//       res.status(500).json({ message: 'Internal server error' });
	//     });
});

router.put('/list', (req, res) => {
// How do I import the user that's currently logged in?
const list = {
	    title: req.body.title,
		date: req.body.date,
		category: req.body.category
};

	User.update(
	    { _id: req.body.userId }, 
	    { $push: { lists: list} }
	)
	.then( updatedData => {
		console.log(updatedData)
		res.json(updatedData);
	})
	.catch(err => {
		console.log(err);
		res.json(err);
	})
});

module.exports = {router};