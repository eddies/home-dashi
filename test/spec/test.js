/* global describe, it */

(function () {
  'use strict';

  describe('Give it some context', function () {
    describe('maybe a bit more context here', function () {
      it('should run here few assertions', function () {

      });
    });
  });
  
  describe('#getAge(birth_year)', function(){
    it('should return the age (in years) calculated from the given birth_year', function() {
      var currentYear = new Date().getFullYear();
      assert.equal(getAge(currentYear), 0);
      assert.equal(getAge(currentYear - 1), 1);
      assert.equal(getAge(currentYear - 50), 50);
    });
    it('should return null if birth_year is undefined, null, empty string, or 0', function() {
      assert.equal(getAge(undefined), null);
      assert.equal(getAge(null), null);
      assert.equal(getAge(''), null);
      assert.equal(getAge(0), null);
    });
  });
  
})();
