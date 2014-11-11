/* globals Application, Ember */

(function() {
  'use strict';

  Application.SearchController = Ember.ArrayController.extend({
    sortProperties: ['username'],
    sortAscending: true,

  });

  Application.SearchItemController = Ember.ObjectController.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {
      addFriend: function() {
        var user = this.get('model');

        this.get('currentUser').get('friends').addObject(user);
        this.get('currentUser').save();

        user.get('friends').addObject(this.get('currentUser'));
        user.save();

        // this.$('.changeFriendStatus').toggleClass('hidden');


      },

      removeFriend: function() {
        var user = this.get('model');

        this.get('currentUser').get('friends').removeObject(user);
        this.get('currentUser').save();

        user.get('friends').removeObject(this.get('currentUser'));
        user.save();

        // this.$('.changeFriendStatus').toggleClass('hidden');
      }
    }
  });


})();
