'use strict';

angular.module('core').controller('HomeController', ['$state', '$scope', '$http', 'Authentication',
  function ($state, $scope, $http, Authentication) {
    // This provides Authentication context.
    $scope.state = $state;
    var orders = $http.get('http://cors.io/?u=https://api.korbit.co.kr/v1/transactions?time=day')
    .then(function(res) {
      console.log('res:', res);
      $scope.orders = res.data;
    })
    .catch(function(err) {
      console.log('err:', err);
    });;
    $scope.authentication = Authentication;
    $scope.orders = orders;
  }
]);
