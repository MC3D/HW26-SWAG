/* globals Application, Ember */

(function() {
  'use strict';

  Application.VerifyUser = Ember.Mixin.create({
    beforeModel: function() {
      var user = this.controllerFor('session').get('currentUser');
      if (!user) {
        this.transitionTo('index');
      }
    },
  });


})();
