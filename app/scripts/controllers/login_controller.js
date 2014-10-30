/* globals Application, Ember */

(function() {
  'use strict';
  Application.LoginController = Ember.ArrayController.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),
    actions: {
      logIn: function() {
        var that = this;
        Application.ref.authWithPassword({
          email: this.get('userEmail'),
          password: this.get('userPassword')
        }, function(error, authData) {
          if (error === null) {
            that.store.find('user', authData.uid).then(function(user) {
              localStorage.setItem('userData', JSON.stringify(user));
              that.set('currentUser', JSON.parse(localStorage.getItem('userData')));
              that.set('currentUser.userRef', authData.uid);
            });
            // self.push('currentUser', authData.uid);
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
