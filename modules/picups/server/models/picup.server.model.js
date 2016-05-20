'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Picup Schema
 */
var PicupSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Picup name',
    trim: true
  },
  url: {
    type: String,
    required: true
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

mongoose.model('Picup', PicupSchema);
