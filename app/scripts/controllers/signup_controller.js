/* globals Application, Ember */

(function() {
  'use strict';

  Application.SignupController = Ember.ArrayController.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),
    actions: {
      signUp: function() {
        var self = this;
        var username = this.get('setUser');
        var email = this.get('setEmail');
        var password = this.get('setPassword');
        var data = {
          email: email,
          password: password
        };
        Application.ref.createUser(data, function(error) {
          if (error === null) {
            Application.ref.authWithPassword(data, function(error, authData) {
              if (error === null) {
                var user = self.store.createRecord('user', {
                  id: authData.uid,
                  username: username,
                  email: email
                });
                user.save().then(function() {
                  localStorage.setItem('userData', JSON.stringify(user));
                  self.set('currentUser', JSON.parse(localStorage.getItem('userData')));
                  self.set('currentUser.userRef', authData.uid);
                });
                console.log('User created successfully');
                self.transitionToRoute('welcome');
              } else {
                console.log('Error creating user:', error);
              }
            });
          }
        });
      }
    }
  });
})();
