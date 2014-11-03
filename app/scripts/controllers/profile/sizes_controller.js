/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileSizesController = Ember.ArrayController.extend({
    needs: ['application'],
    // currentUser: Ember.computed.alias('controllers.application.currentUser.userRef'),
    actions: {

      updateProfile: function() {
        var that = this;
        var id = localStorage.getItem('currentUser.userRef');
        this.store.find('user', id).then(function(user) {
          var props = that.getProperties('hatSize', 'pantSize', 'shirtSize', 'shoeSize');
          user.setProperties(props);
          user.save();
        });
      }
    }
  });
})();
