/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileAversionsController = Ember.Controller.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {

      addAversion: function() {
        var aversion = this.store.createRecord('aversion', {
           aversionText: this.get('aversionText')
         });

        this.get('currentUser').get('aversions').addObject(aversion);
        this.get('currentUser').save();

        this.set('aversionText','');
      },
    }
  });


  Application.AversionController = Ember.ObjectController.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {
      removeAversion: function(){

      var user = this.get('currentUser');
      user.get('aversions').removeObject(this.get('model'));
      user.save();

      }
    }
  });
})();
