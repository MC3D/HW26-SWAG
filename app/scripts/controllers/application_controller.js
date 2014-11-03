/* globals Application, Ember */

(function () {
  'use strict';

  Application.ApplicationController = Ember.Controller.extend({
    currentUser: '',
    init: function() {
      this._super();
      var that = this;
      if(localStorage.getItem('userData')) {
        that.set('currentUser', JSON.parse(localStorage.getItem('userData')));
      }
    }
});
})();
