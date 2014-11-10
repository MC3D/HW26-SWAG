/* globals Application, Ember */

(function () {
  'use strict';

  Application.ApplicationController = Ember.Controller.extend({
    needs: ['session'],
    currentUser: Ember.computed.alias('controllers.session.currentUser'),

    actions: {
      logOut: function() {
        this.transitionToRoute('index');
        //Application.reset();
        //console.log(localStorage.removeItem('currentUser'));



        window.localStorage.clear();
        location.reload();

      },

      goToSwag: function() {
        this.transitionToRoute('swag');
      },

      goToFriends: function() {
        this.transitionToRoute('friends');
      },

      goToProfile: function() {
        this.transitionToRoute('profile.avatar');
      }
    }
});
})();
