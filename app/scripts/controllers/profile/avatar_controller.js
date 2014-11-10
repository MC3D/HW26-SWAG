/* globals Application, Ember, filepicker */

(function() {
  'use strict';

  Application.ProfileAvatarController = Ember.Controller.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {

      addAvatar: function() {
        var that = this;

        filepicker.pickAndStore({},{},function(Blobs){
          that.set('currentUser.imgURL', Blobs[0].url);
        });
      },

       updateProfile: function() {
         this.get('currentUser').save();
         window.alert('Profile Picture Saved');
       }
    }
  });
})();
