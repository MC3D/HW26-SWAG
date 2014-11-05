/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileAversionsController = Ember.Controller.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {

      updateProfile: function() {
        this.get('currentUser').save();
        // var that = this;
        // var props = that.getProperties('aversionText');
        // this.mdoel.setProperties(props);
        // this.model.save();

        // var id = this.controllerFor('application').get('currentUser').id;
        // var user = this.store.find('user', id);
        // var aversion = this.store.createRecord('aversion', {
        //   averstionText: this.get('aversion')
        // });
        // user.get('aversions').addObject(aversion);
        // user.save();


        // var that = this;
        // var props = that.getProperties('hatSize', 'pantSize', 'shirtSize', 'shoeSize');
        // console.log(this.model);
        // this.model.setProperties(props);
        // this.model.save();



        // var id = localStorage.getItem('currentUser.userRef');
        // var user = this.store.find('user', id);
        // var aversion = this.store.createRecord('aversion', {
        //   aversionText: this.get('aversion')
        // });
        //
        // console.log(user);
        // user.get('aversions').addObject(aversion);
        // user.save();
      }
    }
  });
})();
