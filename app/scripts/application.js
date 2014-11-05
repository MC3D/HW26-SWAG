/* globals Ember, Application, DS, Firebase, filepicker */

(function() {
  'use strict';

  window.Application = Ember.Application.create({
    LOG_TRANSITIONS: true
  });

  Application.ref = new Firebase('https://myswag.firebaseio.com/');

  Application.ApplicationAdapter = DS.FirebaseAdapter.extend({
    firebase: Application.ref
  });

  filepicker.setKey('AZCePNZlYTB2qdKHk2cOiz');

  Ember.Application.initializer({
    name: 'firebase-session',

    initialize: function(container, application) {
      var token = localStorage.getItem('firebasetoken');
      if (token) {
        application.deferReadiness();
        var session = container.lookup('controller:session');
        session.authWithToken(token).finally(function() {
          application.advanceReadiness();
        }).catch(function(error){
          console.error(error);
        }).then(function(){
          console.log('success');
        });

      }
    }
  });
})();
