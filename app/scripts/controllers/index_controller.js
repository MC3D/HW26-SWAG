/* globals Application, Ember */

(function() {
  'use strict';

  Application.IndexController = Ember.Controller.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),


  });

})();
