'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Persone Schema
 */
var PersoneSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Persone name',
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

mongoose.model('Persone', PersoneSchema);