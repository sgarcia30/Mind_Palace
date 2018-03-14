'use strict'
// Import desired elements and methods and files
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// Configure routers
const config = require('../config');
const router = express.Router();

// Import user model
const {User} = require('../models/userModel');

// Create the JWT token once logged in
const createAuthToken = function(user) {
	return jwt.sign({user}, config.JWT_SECRET, {
		subject: user.email,
		expiresIn: config.JWT_EXPIRY,
		algorithm: 'HS256'
	});
};

// Setup the local authorizarion variable
const localAuth = passport.authenticate('local', {session: false});
// Tell the router to use body parser
router.use(bodyParser.json());

// Post end point for the user to log in
router.post('/login', localAuth, (req, res) => {
	const authToken = createAuthToken(req.user.serialize());
	res.json({authToken, userId: req.user._id});
});

// Set up the JWT authorization variable
const jwtAuth = passport.authenticate('jwt', {session: false});

// Post to register a new user
router.post('/register', (req, res) => {

	let {email, password, firstName, lastName} = req.body;
	console.log(email);

	firstName = firstName.trim();
	lastName = lastName.trim();

	return User.find({email})
		.count()
		.then(count => {
			if(count > 0) {
				console.log(count);
				return Promise.reject({
					code: 422,
					reason: 'ValidationError',
					message: 'Email already used',
					location: 'email'
				});
			}

			return User.hashPassword(password);
		})
		.then(hash => {
			console.log(hash);
			return User.create({
				email,
				password: hash,
				firstName,
				lastName
			});
		})
		.then(user => {
			return res.status(201).json(user.serialize());
		})
		.catch(err => {
			if(err.reason === 'ValidationError') {
				return res.status(err.code).json(err);
			}
			res.status(500).json({
				code: 500,
				message: 'Internal server error'
			});
		});
});

// Export the router
module.exports = {router};