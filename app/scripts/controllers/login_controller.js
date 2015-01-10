/* globals Application, Ember */

(function() {
  'use strict';
  Application.LoginController = Ember.Controller.extend({
    needs: ['session'],

    actions: {
      logIn: function() {
        var that = this;
        var credentials = this.getProperties('email', 'password');
        this.get('controllers.session').authUser(credentials).then(function(){
          console.log('there');
          that.transitionToRoute('swag');
        });
      },
    }
  });
})();
