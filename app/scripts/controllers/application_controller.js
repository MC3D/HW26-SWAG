/* globals Application, Ember */

(function () {
  'use strict';

  Application.ApplicationController = Ember.Controller.extend({
    needs: ['session'],
    currentUser: Ember.computed.alias('controllers.session.currentUser')
});
})();
