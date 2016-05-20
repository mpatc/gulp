(function () {
  'use strict';

  angular
    .module('picups')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('picups', {
        abstract: true,
        url: '/picups',
        template: '<ui-view/>'
      })
      .state('picups.list', {
        url: '',
        templateUrl: 'modules/picups/client/views/list-picups.client.view.html',
        controller: 'PicupsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Picups List'
        }
      })
      .state('picups.create', {
        url: '/create',
        templateUrl: 'modules/picups/client/views/form-picup.client.view.html',
        controller: 'PicupsController',
        controllerAs: 'vm',
        resolve: {
          picupResolve: newPicup
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Picups Create'
        }
      })
      .state('picups.edit', {
        url: '/:picupId/edit',
        templateUrl: 'modules/picups/client/views/form-picup.client.view.html',
        controller: 'PicupsController',
        controllerAs: 'vm',
        resolve: {
          picupResolve: getPicup
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Picup {{ picupResolve.name }}'
        }
      })
      .state('picups.view', {
        url: '/:picupId',
        templateUrl: 'modules/picups/client/views/view-picup.client.view.html',
        controller: 'PicupsController',
        controllerAs: 'vm',
        resolve: {
          picupResolve: getPicup
        },
        data:{
          pageTitle: 'Picup {{ articleResolve.name }}'
        }
      });
  }

  getPicup.$inject = ['$stateParams', 'PicupsService'];

  function getPicup($stateParams, PicupsService) {
    return PicupsService.get({
      picupId: $stateParams.picupId
    }).$promise;
  }

  newPicup.$inject = ['PicupsService'];

  function newPicup(PicupsService) {
    return new PicupsService();
  }
})();
