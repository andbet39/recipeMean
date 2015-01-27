'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Answer Schema
 */
var AnswerSchema = new Schema({
	reason: {
		type: String,
		default: '',
		required: 'Please fill Answer reason',
		trim: true
	},
	isPro: {
		type: Boolean,
 		required: 'Please set pro or cons',
 	},

	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	enquire : {
		type: Schema.ObjectId,
		ref: 'Enquire'
	}
});

mongoose.model('Answer', AnswerSchema);