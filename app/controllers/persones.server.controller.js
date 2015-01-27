'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Persone = mongoose.model('Persone'),
	_ = require('lodash');

/**
 * Create a Persone
 */
exports.create = function(req, res) {
	var persone = new Persone(req.body);
	persone.user = req.user;

	persone.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(persone);
		}
	});
};

/**
 * Show the current Persone
 */
exports.read = function(req, res) {
	res.jsonp(req.persone);
};

/**
 * Update a Persone
 */
exports.update = function(req, res) {
	var persone = req.persone ;

	persone = _.extend(persone , req.body);

	persone.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(persone);
		}
	});
};

/**
 * Delete an Persone
 */
exports.delete = function(req, res) {
	var persone = req.persone ;

	persone.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(persone);
		}
	});
};

/**
 * List of Persones
 */
exports.list = function(req, res) { 
	Persone.find().sort('-created').populate('user', 'displayName').exec(function(err, persones) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(persones);
		}
	});
};

/**
 * Persone middleware
 */
exports.personeByID = function(req, res, next, id) { 
	Persone.findById(id).populate('user', 'displayName').exec(function(err, persone) {
		if (err) return next(err);
		if (! persone) return next(new Error('Failed to load Persone ' + id));
		req.persone = persone ;
		next();
	});
};

/**
 * Persone authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.persone.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
