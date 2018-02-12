'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');
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

router.put('/list', (req, res) => {
	// How do I import the user that's currently logged in?
	const list = {
		    title: req.body.title,
			date: req.body.date,
			category: req.body.category,
			listId: uuidv1()
	};

	User.update(
	    { _id: req.body.userId }, 
	    { $push: { lists: list} }
	)
	.then( (updatedData) => {
		res.json(list);
	})
	.catch(err => {
		// console.log(err);
		res.json(err);
	})
});

router.post('/list/build', (req, res) => {
	User
	.findOneAndUpdate({_id: req.body.userId, 'lists.listId': req.body.listId},
		// explain the '{new: true}' part?
		{$push: {"lists.$.items": req.body.val}},
		{new: true})
	.then(user => {
		// console.log('User ====', user);
		res.status(200).json(user);
	})
	.catch(err => {
		console.log(err);
		res.status(500);
	})
})

router.get('/:userId/lists/:listId', (req, res) => {
	// can I do this without having to search the users list for the desired list?
	User
	.findOne({_id: req.params.userId, 'lists.listId': req.params.listId})
	.then(user => {
		const userLists = user.lists;
		const desList = userLists.find(list => {
			return list.listId === req.params.listId;
		})
		res.json(desList);
	})
	.catch(err => {
		console.log(err);
		res.status(500);
	})
})

router.get('/:userId/list', (req, res) => {
	User
	.findOne({_id: req.params.userId})
	.then(user => {
		console.log(user);
		res.json(user);
	})
})

module.exports = {router};