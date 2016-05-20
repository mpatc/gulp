'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Picup = mongoose.model('Picup'),
  AWS = require('aws-sdk'),
  fs = require('fs'),
  multer = require('multer'),
  uuid = require('uuid'),
  s3 = new AWS.S3(),
  bucketName = 'bitease',
  urlBase = 'https://s3.amazonaws.com/',
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  config = require(path.resolve('./config/config')),
  key = uuid(),
  params = {
    Bucket: bucketName,
    Key: key,
    ACL: 'public-read',
    Body: 'data'
  }
  ;

/**
 * Create a Picup
 */
exports.create = function(req, res) {
  var picup = new Picup(req.body);
  picup.user = req.user;
  var message = null;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  upload.fileFilter = profileUploadFileFilter;

  picup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(picup);
    }
  });
};

/**
 * Show the current Picup
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var picup = req.picup ? req.picup.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  picup.isCurrentUserOwner = req.user && picup.user && picup.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(picup);
};

/**
 * Update a Picup
 */
exports.update = function(req, res) {
  var picup = req.picup ;


  picup = _.extend(picup , req.body);

  picup.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(picup);
    }
  });
};

/**
 * Delete an Picup
 */
exports.delete = function(req, res) {
  var picup = req.picup ;

  picup.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(picup);
    }
  });
};

/**
 * List of Picups
 */
exports.list = function(req, res) {
  Picup.find().sort('-created').populate('user', 'displayName').exec(function(err, picups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(picups);
    }
  });
};

/**
 * Picup middleware
 */
exports.picupByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Picup is invalid'
    });
  }

  Picup.findById(id).populate('user', 'displayName').exec(function (err, picup) {
    if (err) {
      return next(err);
    } else if (!picup) {
      return res.status(404).send({
        message: 'No Picup with that identifier has been found'
      });
    }
    req.picup = picup;
    next();
  });
};
