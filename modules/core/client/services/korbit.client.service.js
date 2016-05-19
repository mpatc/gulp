'use strict';


angular.module('core').service('Korbit', [
  function ($http) {
    this.getAll = function () {
      return $http.post('/api', { url: 'https://api.korbit.co.kr/v1/transactions?time=day' });
    };
    this.getCurrent = function() {
      return $http.post('/api/ajax', { url: 'https://api.korbit.co.kr/v1/orderbook' });

    };

  }]);
