/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileDatesController = Ember.ArrayController.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),


  });

})();
