/* globals Application, Ember */

(function () {
  'use strict';

  Application.ApplicationController = Ember.Controller.extend({
    needs: ['session'],
    currentUser: Ember.computed.alias('controllers.session.currentUser'),

    actions: {
      logOut: function() {
        this.transitionToRoute('index');


        

        window.localStorage.clear();
        location.reload();

      },

      goToSwag: function() {
        this.transitionToRoute('swag');
      },

      goToSwagroom: function() {
        this.transitionToRoute('swagroom');
      },

      goToProfile: function() {
        this.transitionToRoute('profile.avatar');
      }
    }
});
})();
