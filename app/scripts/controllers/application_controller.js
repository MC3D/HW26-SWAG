/* globals Application, Ember */

(function () {
  'use strict';

  Application.ApplicationController = Ember.Controller.extend({
    needs: ['session'],
    currentUser: Ember.computed.alias('controllers.session.currentUser'),

    actions: {
      logOut: function() {
        //this.transitionToRoute('index');
        localStorage.removeItem('firebasetoken');
        Application.reset();
        var dataRef = Application.ref;
        dataRef.unauth();
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
