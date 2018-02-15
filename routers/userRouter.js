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
	const list = {
	    title: req.body.title,
		date: req.body.date,
		category: req.body.category,
		listId: uuidv1()
	};

	User.findOne({_id: req.body.userId})
	.then(user => {
		const lists = user.lists;
		lists.forEach(item => {
			console.log(item.title);
			console.log(list.title);
			if (item.title === list.title) {
				res.json({message: 'List already exists'});
			}
		})
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
	User
	.findOne({_id: req.params.userId})
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
		res.json(user);
	})
})

router.delete('/:userId/lists/:listId', (req, res) => {
	User
	.findOne({_id: req.params.userId})
	.then(user => {
		const userLists = user.lists;
		userLists.find(list => {
			if (list.listId === req.params.listId) {
				console.log(list);
				list = null;
				
			}
		})
		console.log(`Deleted desired list \`${req.params.listId}\``);
    	res.status(204).end();
	})
	.catch(err => {
		console.log(err);
		res.status(500);
	})
})

module.exports = {router};