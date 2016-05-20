(function () {
  'use strict';

  angular
    .module('picups')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Picups',
      state: 'picups',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'picups', {
      title: 'List Picups',
      state: 'picups.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'picups', {
      title: 'Create Picup',
      state: 'picups.create',
      roles: ['user']
    });
  }
})();
