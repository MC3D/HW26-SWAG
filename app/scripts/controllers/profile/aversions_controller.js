/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileSizesController = Ember.ArrayController.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),
    actions: {

      updateProfile: function() {
        var user = this.currentUser;
        var props = this.getProperties('aversion');
        user.setProperties(props).then(user.save());
       },
     }
  });
})();
