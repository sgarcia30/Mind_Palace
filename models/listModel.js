const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListsSchema = new Schema({
	title: {type: String, unique: true, required: true},
	date: {type: String, min: 6, required: true},
	category: String
});

module.exports = mongoose.model('List', ListsSchema);