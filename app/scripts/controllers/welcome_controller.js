/* globals Application, Ember */

(function() {
  'use strict';

  Application.WelcomeController = Ember.ArrayController.extend({
    actions: {
      welcome: function() {
        var self = this;
        self.transitionToRoute('profile.dates');
      }
    }
  });


})();
