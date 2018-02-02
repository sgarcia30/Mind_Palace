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
		User
		    .lists.find()
		    .limit(10)
		    .then(lists => {
				res.json(lists)
		    })
		    .catch(err => {
		      console.error(err);
		      res.status(500).json({ message: 'Internal server error' });
		    });
});

router.put('/list', (req, res) => {
// How do I import the user that's currently logged in?
const list = {
	    title: req.body.title,
		date: req.body.date,
		category: req.body.category
};
console.log(list);

User.update(
    { _id: req.body.userId }, 
    { $push: { lists: list} },
    (updatedData) => res.json(updatedData)
);
});

module.exports = {router};