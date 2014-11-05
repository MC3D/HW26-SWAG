/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileSizesController = Ember.Controller.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),


    actions: {

      updateProfile: function() {
        // var that = this;
        // var props = that.getProperties('hatSize', 'pantSize', 'shirtSize', 'shoeSize');
        // this.model.setProperties(props);
        // this.model.save();
        this.get('currentUser').save();
      }
    }
  });
})();
