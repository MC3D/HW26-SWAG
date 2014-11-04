/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileAversionsController = Ember.ArrayController.extend({
    needs: ['application'],

    actions: {

      updateProfile: function() {
        var id = localStorage.getItem('currentUser.userRef');
        var user = this.store.find('user', id);
        var aversion = this.store.createRecord('aversion', {
          aversionText: this.get('aversion')
        });
        
        console.log(user);
        user.get('aversions').addObject(aversion);
        user.save();
      }
    }
  });
})();
