'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {User} = require('../models/userModel');

const router = express.Router();

const jsonParser = bodyParser.json();



router.get('/', (req, res) => {
	return User.find()
	  .then(users => res.json(users.map(user => user.serialize())))
	  .catch(err => res.status(500).json({
	  	message: 'Internal server error'
	  }));
});

module.exports = {router};