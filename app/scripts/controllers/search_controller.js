/* globals Application, Ember */

(function() {
  'use strict';

  Application.SearchController = Ember.ArrayController.extend({
    sortProperties: ['username'],
    sortAscending: true,

    actions: {
      viewFriends: function() {
        this.transitionToRoute('friends');
      },

    }

  });

  Application.SearchItemController = Ember.ObjectController.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),
    disabled: false,

    actions: {
      addFriend: function() {
        var user = this.get('model');

        this.get('currentUser').get('friends').addObject(user);
        this.get('currentUser').save();

        user.get('friends').addObject(this.get('currentUser'));
        user.save();

        this.set('disabled', true);

      },

      removeFriend: function() {
        var user = this.get('model');

        this.get('currentUser').get('friends').removeObject(user);
        this.get('currentUser').save();

        user.get('friends').removeObject(this.get('currentUser'));
        user.save();

        this.set('disabled', true);

      },




    }
  });


})();
