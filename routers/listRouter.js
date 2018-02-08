// const express = require('express');
// const router = express.Router();
// const bodyParser = require('body-parser');

// router.use(bodyParser.json());

// const User = require('../models/userModel.js');

// router.get('/', (req, res) => {
// 		List
// 		    .find()
// 		    .limit(10)
// 		    .then(lists => {
// 				res.json(lists)
// 		    })
// 		    .catch(err => {
// 		      console.error(err);
// 		      res.status(500).json({ message: 'Internal server error' });
// 		    });
// });

// router.post('/', (req, res) => {
// 	console.log(req.body)
// 	User.create ({
// 		title: req.body.title,
// 		date: req.body.date,
// 		category: req.body.category
// 	})
// });


// router.put('/', (req, res) => {
//  User.findOneAndUpdate({
//         "_id": ''
//     }, {
//         "$push": {lists: {}}
//     },{new:true, upsert: true}, function(err, doc) {
//         if (err)
//             throw err; // handle error;
//         }
//         console.log(doc)
//     ); 
// });

// router.delete('/', (req, res) => {
// 	res.send('Made DELETE request');
// });

// module.exports = router;