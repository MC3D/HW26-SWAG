/* globals Application, Ember */

(function() {
  'use strict';

  Application.SessionController = Ember.Controller.extend({
    needs: ['application'],
    currentUser: null,

    authUser: function(credentials) {
      var that = this;
      return new Ember.RSVP.Promise(function(resolve, reject) {
        Application.ref.authWithPassword(
          credentials,
          function(error, authData) {
            if (error === null) {
              that.setStorage(authData).then(resolve, reject);
            } else {
              console.log('error in Session Controller authUser');
            }
        });
      });
    },

    setStorage: function(authData) {
      var that = this;
      return new Ember.RSVP.Promise(function(resolve, reject) {
        localStorage.setItem('firebasetoken', authData.token);
        console.log('About to find user', authData.uid);
        that.store.find('user', authData.uid).then(function(user) {
            console.log('User:', user);
            that.set('currentUser', user);
            resolve(user);
          },
          function(error) {
            // The user wasn't found, so I must create it
            // if (error === null) {
              console.error('Not found', error);
              /////////////////////////////////////////////////////////////////set username here
              var user = that.store.recordForId('user', authData.uid);
              if(user){
                user.loadedData();
                that.set('currentUser', user);
                resolve(user);
              } else {
                reject();
              }
          });
      });
    },

    authWithToken: function(token) {
      var that = this;
      return new Ember.RSVP.Promise(function(resolve, reject) {
        Application.ref.authWithCustomToken(token, function(error, authData) {
          if (error === null) {
            that.setStorage(authData).then(resolve, reject);
            console.log('Login Succeeded!', authData);
          } else {
            reject(error);
            console.log('Login Failed!', error);
            console.log('Error authenticating user:', error);
          }
        });
      });
    }
  });
})();
