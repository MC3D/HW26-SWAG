/* globals Application, Ember */

(function() {
  'use strict';

  Application.SwagroomIndexController = Ember.ArrayController.extend({

    sortProperties: ['username'],
    sortAscending: true,

    actions: {
      findFriends: function() {
        this.transitionToRoute('search');
      },
    }
  });

  Application.SwagroomItemController = Ember.ObjectController.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {
      removeFriend: function() {
        var user = this.get('model');

        this.get('currentUser').get('friends').removeObject(user);
        this.get('currentUser').save();

        user.get('friends').removeObject(this.get('currentUser'));
        user.save();
      },
    }
  });
})();
