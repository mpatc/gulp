(function () {
  'use strict';

  describe('Picups Route Tests', function () {
    // Initialize global variables
    var $scope,
      PicupsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PicupsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PicupsService = _PicupsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('picups');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/picups');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          PicupsController,
          mockPicup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('picups.view');
          $templateCache.put('modules/picups/client/views/view-picup.client.view.html', '');

          // create mock Picup
          mockPicup = new PicupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Picup Name'
          });

          //Initialize Controller
          PicupsController = $controller('PicupsController as vm', {
            $scope: $scope,
            picupResolve: mockPicup
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:picupId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.picupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            picupId: 1
          })).toEqual('/picups/1');
        }));

        it('should attach an Picup to the controller scope', function () {
          expect($scope.vm.picup._id).toBe(mockPicup._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/picups/client/views/view-picup.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PicupsController,
          mockPicup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('picups.create');
          $templateCache.put('modules/picups/client/views/form-picup.client.view.html', '');

          // create mock Picup
          mockPicup = new PicupsService();

          //Initialize Controller
          PicupsController = $controller('PicupsController as vm', {
            $scope: $scope,
            picupResolve: mockPicup
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.picupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/picups/create');
        }));

        it('should attach an Picup to the controller scope', function () {
          expect($scope.vm.picup._id).toBe(mockPicup._id);
          expect($scope.vm.picup._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/picups/client/views/form-picup.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PicupsController,
          mockPicup;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('picups.edit');
          $templateCache.put('modules/picups/client/views/form-picup.client.view.html', '');

          // create mock Picup
          mockPicup = new PicupsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Picup Name'
          });

          //Initialize Controller
          PicupsController = $controller('PicupsController as vm', {
            $scope: $scope,
            picupResolve: mockPicup
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:picupId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.picupResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            picupId: 1
          })).toEqual('/picups/1/edit');
        }));

        it('should attach an Picup to the controller scope', function () {
          expect($scope.vm.picup._id).toBe(mockPicup._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/picups/client/views/form-picup.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
