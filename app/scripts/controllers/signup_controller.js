/* globals Application, Ember */

(function() {
  'use strict';

  Application.SignupController = Ember.ArrayController.extend({
    needs: ['session'],

    actions: {

      generateTemporaryPassword: function(){
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?_-';
        var password = '';

        for(var i=0; i<16;i++){
          password += chars[Math.floor(Math.random()*chars.length)];
        }
      },

      signUp: function() {
        var that = this;
        var credentials = this.getProperties('email', 'password');

        console.log(credentials);

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
                that.transitionToRoute('profile.avatar');
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
