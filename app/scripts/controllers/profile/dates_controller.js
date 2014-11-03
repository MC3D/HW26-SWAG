/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileDatesController = Ember.ArrayController.extend({
    needs: ['application'],
    
    actions: {

       updateProfile: function() {
         var that = this;
         var id = localStorage.getItem('currentUser.userRef');
         this.store.find('user', id).then(function(user) {
           var props = that.getProperties('birthday', 'anniversary');
           user.setProperties(props);
           user.save();
         });
       }


     }
  });
})();
