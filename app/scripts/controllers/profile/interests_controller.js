/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileInterestsController = Ember.ArrayController.extend({
    needs: ['application'],
    // currentUser: Ember.computed.alias('controllers.application.currentUser'),
    actions: {

      updateProfile: function() {
         var that = this;
         var id = localStorage.getItem('currentUser.userRef');
         this.store.find('user', id).then(function(user) {
           var props = that.getProperties('interests');
           user.setProperties(props);
           user.save();
         });
       }
     }
  });
})();
