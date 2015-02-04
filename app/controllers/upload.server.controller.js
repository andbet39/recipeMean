'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');

	var Grid = require('gridfs-stream');
	//var multiparty = require('multiparty');

	Grid.mongo = mongoose.mongo;
	var gfs = new Grid(mongoose.connection.db);
 
var Busboy = require('busboy');
 
 	
/**
 * Create a Upload
 */
exports.create = function(req, res) {

	     
	   	console.log(req.files);
	   	
	    	var part = req.files.filefield;
                console.log(req);

                var writeStream = gfs.createWriteStream({
                     filename: part.name,
    
                     content_type:part.mimetype
                });


                writeStream.on('close', function() {
                     return res.status(200).send({
						message: 'Success'
					});
                });
                
                req.files.filefield.pipe(writeStream);

};

/**
 * Show the current Upload
 */
exports.read = function(req, res) {

	var readstream = gfs.createReadStream({
	  filename: 'ISS.jpg'
	});
	 
	//error handling, e.g. file does not exist 

	console.log('file readed');



	res.writeHead(200, {
       
    });
    
    readstream.on('data', function(data) {
        res.write(data);
    });
    
    readstream.on('end', function() {
        res.end();        
    });

		readstream.on('error', function (err) {
		  console.log('An error occurred!', err);
		  throw err;
		});


};

/**
 * Update a Upload
 */
exports.update = function(req, res) {

};

/**
 * Delete an Upload
 */
exports.delete = function(req, res) {

};

/**
 * List of Uploads
 */
exports.list = function(req, res) {

};