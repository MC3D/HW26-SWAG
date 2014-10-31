/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileDatesView = Ember.View.extend({
    didInsertElement: function() {
      this.$('.birthday').pickadate();
      this.$('.anniversary').pickadate();
    }
  });
  
})();
