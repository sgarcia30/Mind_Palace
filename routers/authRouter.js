'use strict'

const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const {User} = require('../models/userModel');

const createAuthToken = function(user) {
	return jwt.sign({user}, config.JWT_SECRET, {
		subject: user.email,
		expiresIn: config.JWT_EXPIRY,
		algorithm: 'HS256'
	});
};

const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());

router.post('/login', localAuth, (req, res) => {
	const authToken = createAuthToken(req.user.serialize());
	res.json({authToken, userId: req.user._id});
});

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

module.exports = {router};