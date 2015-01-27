'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Enquire Schema
 */
var EnquireSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: 'Please fill Enquire title',
		trim: true
	},
	text: {
		type: String,
		default: '',
		required: 'Please fill Enquire text',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Enquire', EnquireSchema);