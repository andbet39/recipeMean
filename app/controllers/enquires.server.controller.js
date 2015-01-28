'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Enquire = mongoose.model('Enquire'),
	_ = require('lodash');


exports.increseVisitCounter = function (req,res){

	var conditions = { '_id' : req.params.enquireId }; 
	var update = {$inc : {visit : 1}}; 


	Enquire.update(conditions, update,	function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.status(200).send();
		}
	});
	 
};
/**
 * Create a Enquire
 */
exports.create = function(req, res) {
	var enquire = new Enquire(req.body);
	enquire.user = req.user;

	enquire.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(enquire);
		}
	});
};

/**
 * Show the current Enquire
 */
exports.read = function(req, res) {
	res.jsonp(req.enquire);
};

/**
 * Update a Enquire
 */
exports.update = function(req, res) {
	var enquire = req.enquire ;

	enquire = _.extend(enquire , req.body);

	enquire.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(enquire);
		}
	});
};

/**
 * Delete an Enquire
 */
exports.delete = function(req, res) {
	var enquire = req.enquire ;

	enquire.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(enquire);
		}
	});
};

/**
 * List of Enquires
 */
exports.list = function(req, res) { 
	Enquire.find().sort('-created').populate('user', 'displayName').exec(function(err, enquires) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(enquires);
		}
	});
};

/**
 * Enquire middleware
 */
exports.enquireByID = function(req, res, next, id) { 
	Enquire.findById(id).populate('user', 'displayName').exec(function(err, enquire) {
		if (err) return next(err);
		if (! enquire) return next(new Error('Failed to load Enquire ' + id));
		req.enquire = enquire ;
		next();
	});
};

/**
 * Enquire authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.enquire.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
