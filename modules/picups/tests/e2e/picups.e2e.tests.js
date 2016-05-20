'use strict';

describe('Picups E2E Tests:', function () {
  describe('Test Picups page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/picups');
      expect(element.all(by.repeater('picup in picups')).count()).toEqual(0);
    });
  });
});
