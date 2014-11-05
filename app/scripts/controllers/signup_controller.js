/* globals Application, Ember */

(function() {
  'use strict';

  Application.SignupController = Ember.ArrayController.extend({
    needs: ['session'],

    actions: {
      signUp: function() {
        var that = this;
        var credentials = this.getProperties('email', 'password');

        Application.ref.createUser(credentials, function(error) {
          if (! error) {
            that.get('controllers.session').authUser(credentials).then(function(user) {
              console.log('here it is');
              user.setProperties({
                username: that.get('username'),
                email: that.get('email')
              });
              user.save().then(function() {
                console.log('User created successfully');
                that.transitionToRoute('welcome');
              });
            });
          } else {
            console.log('Error creating user:', error);
          }
        });
      }
    }
  });
})();
