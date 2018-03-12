'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');
const {User} = require('../models/userModel');
const path = require('path');

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
		let canCreatList = true;
		lists.forEach(item => {
			if (item.title === list.title) {
				canCreatList = false;
			}
		})
	if (canCreatList) {
		User.update(
		    { _id: req.body.userId }, 
		    { $push: { lists: list} }
		)
		.then( (updatedData) => {
			res.json(list);
		})
		.catch(err => {
			res.json(err);
		})
	}
	else {
		res.json({message: 'A list already exists with that title.'})
	}
	})
});

router.post('/list/build', (req, res) => {
	const listVal = {item: req.body.val, complete: false, itemId: uuidv1()};

	User
	.findOneAndUpdate({_id: req.body.userId, 'lists.listId': req.body.listId},
		{$push: {"lists.$.items": listVal}},
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

// * Inside the end point we need to write the logic
// to update the items complete property from false to true 
// ie opposite of what it was when a user clicked on it.
router.put('/list/build/item', (req, res) => {

        User.findOne({_id: req.body.userId}, (error, user) => {
        // Do some mutations
            const userListIndex = user.lists.findIndex(list => list.listId === req.body.listId);
            const userItemIndex = user.lists[userListIndex].items.findIndex(item => item.itemId === req.body.itemId);

            user.lists[userListIndex].items[userItemIndex].complete = !user.lists[userListIndex].items[userItemIndex].complete;

            // Pass in the mutated user and replace
            User.replaceOne({_id: req.body.userId}, user, (error, newUser) => {
                res.json({msg: 'Success'});
            })
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
	.findOneAndUpdate({_id: req.params.userId},
		{$pull: {lists: {listId: req.params.listId} }})
	.then(list => {
		console.log(`Deleted desired list \`${req.params.listId}\``);
    	res.status(204).end();
	})
	.catch(err => {
		console.log(err);
		res.status(500);
	})
})

router.delete('/:userId/lists/:listId/items/:itemIndex', (req, res) => {
	const userId = req.params.userId;
	const listId = req.params.listId;
	const itemIndex = req.params.itemIndex;

	User
	.findOne({_id: req.params.userId})
	.then(user => {
		const userLists = user.lists;
		const desList = userLists.find(list => {
			return list.listId === req.params.listId
		})
		const desItems = desList.items;
		desItems.splice(itemIndex, 1);
		user.save()
		.then(updatedUser => {
			res.status(204).json(updatedUser)
		})
	})
	.catch(err => {
		console.log(err);
		res.status(500);
	})
})

router.post('/calendar', (req, res) => {
	console.log(req.body.endDate);
	if (req.body.endDate === '') {
		req.body.endDate = req.body.startDate;
	}

	const event = {
		    title: req.body.title,
			startDate: req.body.startDate,
			endDate: req.body.endDate,
			startTime: req.body.startTime,
			endTime: req.body.endTime,
			eventId: uuidv1()
	};

	User
	.findOneAndUpdate({_id: req.body.userId},
		{$push: {events: event}},
		{new: true})
	.then(user => {
		console.log(user)
		res.status(200).json(user)
	})
	.catch(err => {
		console.log(err)
		res.status(500)
	})
})

router.get('/:userId/calendar', (req, res) => {
	User
	.findOne({_id: req.params.userId})
	.then(user => {
		const events = user.events;
		console.log(events);
		res.json(events);
	})
	.catch(err => {
		console.log(err);
		res.status(500);
	})
})

router.delete('/:userId/calendar/:eventId', (req, res) => {
	const userId = req.params.userId;
	const eventId = req.params.eventId;

	User
	.findOneAndUpdate({_id: userId},
		{$pull: {events: {eventId: eventId} }})
	.then(event => {
		console.log(`Deleted desired event \`${eventId}\``);
    	res.status(204).end();
	})
	.catch(err => {
		console.log(err);
		res.status(500);
	})
})

router.get('/:userId/calendar/:eventId', (req, res) => {
	User
	.findOne({_id: req.params.userId})
	.then(user => {
		const userEvents = user.events;
		const desEvent = userEvents.find(event => {
			return event.eventId === req.params.eventId;
		})
		res.json(desEvent);
	})
	.catch(err => {
		console.log(err);
		res.status(500);
	})	
})

// set-up an edit end point to update the data coming from the ajax
router.put('/:userId/calendar/:eventId', (req, res) => {
	const event = {
	    title: req.body.title,
		startDate: req.body.startDate,
		endDate: req.body.endDate,
		startTime: req.body.startTime,
		endTime: req.body.endTime,
		eventId: req.params.eventId
	};

	User
	.findOneAndUpdate({_id: req.params.userId, 'events.eventId': req.params.eventId},
		{$set: {"events.$": event}},
		{new: true})
	.then(user => {
		res.status(200).json(user);
	})
	.catch(err => {
		console.log(err);
		res.status(500);
	})
})

module.exports = {router};