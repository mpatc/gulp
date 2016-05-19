(function () {
  'use strict';

  angular
    .module('pictures')
    .controller('PicturesListController', PicturesListController);

  PicturesListController.$inject = ['PicturesService'];

  function PicturesListController(PicturesService) {
    var vm = this;

    vm.pictures = PicturesService.query();
  }
})();
