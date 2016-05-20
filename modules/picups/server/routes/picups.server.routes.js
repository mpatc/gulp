'use strict';

/**
 * Module dependencies
 */
var picupsPolicy = require('../policies/picups.server.policy'),
  picups = require('../controllers/picups.server.controller');

module.exports = function(app) {
  // Picups Routes
  app.route('/api/picups').all(picupsPolicy.isAllowed)
    .get(picups.list)
    .post(picups.create);

  app.route('/api/picups/:picupId').all(picupsPolicy.isAllowed)
    .get(picups.read)
    .put(picups.update)
    .delete(picups.delete);

  // Finish by binding the Picup middleware
  app.param('picupId', picups.picupByID);
};
