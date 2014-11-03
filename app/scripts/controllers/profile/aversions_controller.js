/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileAversionsController = Ember.ArrayController.extend({
    needs: ['application'],
    // currentUser: Ember.computed.alias('controllers.application.currentUser'),
    actions: {

      updateProfile: function() {
          var that = this;
          var id = localStorage.getItem('currentUser.userRef');
          this.store.find('user', id).then(function(user) {
            var props = that.getProperties('aversions');
            user.setProperties(props);
            user.save();
          });
        }
     }
  });
})();
