(function () {
  'use strict';

  // Picups controller
  angular
    .module('picups')
    .controller('PicupsController', PicupsController);

  PicupsController.$inject = ['$scope', '$timeout', '$state', 'FileUploader', 'Authentication', 'picupResolve'];

  function PicupsController ($scope, $timeout, $state, FileUploader, Authentication, picup) {
    $scope.uploader = new FileUploader({
      url: 'api/pi/picture',
      alias: 'newPicture'
    });



    var vm = this;
    vm.authentication = Authentication;
    vm.picup = picup;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Picup
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.picup.$remove($state.go('picups.list'));
      }
    }

    // Save Picup
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.picupForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.picup._id) {
        vm.picup.$update(successCallback, errorCallback);
      } else {
        vm.picup.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('picups.view', {
          picupId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
