// User model
'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		default: ''
	},
	lastName: {
		type: String,
		default: ''
	},
	lists: [{
		title: {
			type: String,
			required: true
		},
		date: {
			type: String,
			required: true
		},
		items: Array,
		category: {
			type: String,
			default: ''
		},
		listId: {
			type: String,
			required: true
		}
	}],
	events: [{
		title: {
			type: String,
			required: true
		},
		startDate: {
			type: String,
			required: true
		},
		endDate: {
			type: String,
			required: true
		},
		startTime: {
			type: String,
			required: true
		},
		endTime: {
			type: String,
			required: true
		},
		eventId: String
	}],
	logs: Array
});

// Serializes the user info to send to the frontend
UserSchema.methods.serialize = function () {
	return {
		email: this.email || '',
		firstName: this.firstName || '',
		lastName: this.lastName || ''
	};
};

// Validates the user password
UserSchema.methods.validatePassword = function(password) {
	return bcrypt.compare(password, this.password);
};

// Creates a hash of the user password to be stored in the backend
UserSchema.statics.hashPassword = function(password) {
	return bcrypt.hash(password, 10);
};

// Creates the name and setup for the user model
const User = mongoose.model('User', UserSchema);

// Exports the user model
module.exports = {User};