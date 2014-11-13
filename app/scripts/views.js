/* globals Application, Ember, Drop, Handlebars */

(function() {
  'use strict';

  Application.ProfileDatesView = Ember.View.extend({
    didInsertElement: function() {
      this.$('.birthday').pickadate();
      this.$('.anniversary').pickadate();
    }
  });

  Application.FriendsShowView = Ember.View.extend({

    didInsertElement: function() {
      var that = this;
      var eachTemplate = Handlebars.compile('{{#each content}}<p>{{this}}</p>{{/each}}');

      console.log(that.get('controller.model.interests'));

      this.$('.drop-dates').each(function() {
          new Drop({
          target: this,
          content: eachTemplate({content: that.get('controller.dates')}),
          position: 'top left',
          openOn: 'click',
          classes: 'drop-theme-arrows-bounce-dark',
          constrainToScrollParent: false,
        });
      });

      this.$('.drop-sizes').each(function() {
        new Drop({
          target: this,
          content: eachTemplate({content: that.get('controller.sizes')}),
          position: 'top left',
          openOn: 'click',
          classes: 'drop-theme-arrows-bounce-dark',
          constrainToScrollParent: false,
        });
      });

      this.$('.drop-interests').each(function() {
        new Drop({
          target: this,
          content: eachTemplate({content: that.get('controller.interests')}),
          position: 'top left',
          openOn: 'click',
          classes: 'drop-theme-arrows-bounce-dark',
          constrainToScrollParent: false,
        });
      });

      this.$('.drop-aversions').each(function() {
        new Drop({
          target: this,
          content: eachTemplate({content: that.get('controller.aversions')}),
          position: 'top left',
          openOn: 'click',
          classes: 'drop-theme-arrows-bounce-dark',
          constrainToScrollParent: false,
        });
      });
    }
  });
})();
