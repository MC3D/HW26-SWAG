/* globals Application, Ember */

(function () {
  'use strict';

  Application.ApplicationController = Ember.Controller.extend({
    currentUser: '',
    init: function() {
      this._super();
      var self = this;
      if(localStorage.getItem('userData')) {
        self.set('currentUser', JSON.parse(localStorage.getItem('userData')));
      }
    }
});



})();
