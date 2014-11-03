/* globals Application, Ember */

(function() {
  'use strict';
  Application.LoginController = Ember.ArrayController.extend({
    needs: ['application'],
    

    actions: {
      logIn: function() {
        var that = this;
        Application.ref.authWithPassword({
          email: this.get('userEmail'),
          password: this.get('userPassword')
        }, function(error, authData) {
          if (error === null) {
            that.store.find('user', authData.uid).then(function(user) {
              localStorage.setItem('currentUser', JSON.stringify(user));
              // localStorage.setItem('currentUser', JSON.parse(localStorage.getItem('userData')));
              localStorage.setItem('currentUser.userRef', authData.uid);
            });
            that.transitionToRoute('swag');
            console.log('User ID: ' + authData.uid + ', Provider: ' + authData.provider);
          } else {
            console.log('Error authenticating user:', error);
          }
        });
      },
    }
  });
})();
