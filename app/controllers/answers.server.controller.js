'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Answer = mongoose.model('Answer'),
	_ = require('lodash');
  
  var ObjectId = (require('mongoose').Types.ObjectId);

/**
 * Create a Answer
 */
exports.create = function(req, res) {
	var answer = new Answer(req.body);
	answer.user = req.user;
	answer.enquire._id = req.enquire;

	console.log (answer);

	answer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(answer);
		}
	});
};

/**
 * Show the current Answer
 */
exports.read = function(req, res) {
	res.jsonp(req.answer);
};

/**
 * Update a Answer
 */
exports.update = function(req, res) {
	var answer = req.answer ;

	answer = _.extend(answer , req.body);

	answer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(answer);
		}
	});
};

/**
 * Delete an Answer
 */
exports.delete = function(req, res) {
	var answer = req.answer ;

	answer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(answer);
		}
	});
};

/**
 * List of Answers
 */
exports.list = function(req, res) { 
	Answer.find().sort('-created').populate('user', 'displayName').exec(function(err, answers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(answers);
		}
	});
};

/**
 * Answer middleware
 */
exports.answerByID = function(req, res, next, id) { 
	Answer.findById(id).populate('user', 'displayName').exec(function(err, answer) {
		if (err) return next(err);
		if (! answer) return next(new Error('Failed to load Answer ' + id));
		req.answer = answer ;
		next();
	});
};

exports.answerByEnquireID = function(req,res){
	console.log('Queried Answer for enquire id  :' + req.params.enquireId);

	Answer.find({'enquire': new ObjectId(req.params.enquireId)}).sort('-created').exec(function(err, answers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(answers);
		}
	});

};


/**
 * Answer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.answer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
