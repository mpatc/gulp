(function () {
  'use strict';

  angular
    .module('picups')
    .controller('PicupsListController', PicupsListController);

  PicupsListController.$inject = ['PicupsService'];

  function PicupsListController(PicupsService) {
    var vm = this;

    vm.picups = PicupsService.query();
  }
})();
