/* globals Application, Ember, filepicker */

(function() {
  'use strict';

  Application.SwagController = Ember.Controller.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {

      addImage: function() {
        var that = this;

        filepicker.pickAndStore({}, {}, function(Blobs) {
          that.set('swagURL', Blobs[0].url);
        });
      },

      saveSwag: function() {

        var swag = this.store.createRecord('swag', {
          swagURL: this.get('swagURL'),
          description: this.get('description'),
          retailer: this.get('retailer'),
          location: this.get('location'),
          price: this.get('price')
        });

        swag.save();

        this.get('currentUser.swagbag').addObject(swag);
        this.get('currentUser').save();

      },
    }
  });

  Application.SwagItemController = Ember.ObjectController.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {
      removeSwag: function() {

        var user = this.get('currentUser');
        user.get('swagbag').removeObject(this.get('swag'));
        user.save();

        this.get('model').destroyRecord();
      }
    }
  });
})();
