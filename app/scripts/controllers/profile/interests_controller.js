/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileInterestsController = Ember.Controller.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {

      addInterest: function() {
        var interest = this.store.createRecord('interest', {
           interestText: this.get('interestText')
         });
         console.log(interest);

        this.get('currentUser').get('interests').addObject(interest);
        this.get('currentUser').save();
        console.log(this.get('currentUser'));
      },
    }
  });


  Application.InterestController = Ember.ObjectController.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {
      removeInterest: function(){

      var user = this.get('currentUser');
      user.get('interests').removeObject(this.get('model'));
      user.save();

      }
    }
  });
})();
