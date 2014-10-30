/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileIndexController = Ember.ArrayController.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),


  });

})();
