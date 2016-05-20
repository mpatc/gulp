//Picups service used to communicate Picups REST endpoints
(function () {
  'use strict';

  angular
    .module('picups')
    .factory('PicupsService', PicupsService);

  PicupsService.$inject = ['$resource'];

  function PicupsService($resource) {
    return $resource('api/picups/:picupId', {
      picupId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
