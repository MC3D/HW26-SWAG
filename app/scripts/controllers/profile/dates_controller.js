/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileDatesController = Ember.Controller.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {
      updateProfile: function() {
        this.get('currentUser').save();
      }
    }
  });
})();
