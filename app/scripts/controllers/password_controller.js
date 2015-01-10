/* globals Application, Ember */

(function() {
  'use strict';

    Application.PasswordController = Ember.Controller.extend({
    needs: ['session'],

    actions: {
      changePassword: function() {
        // var that = this;
        // var credentials = this.getProperties('email', 'password');

        Application.ref.changePassword({
          email: this.get('email'),
          oldPassword: this.get(''),
          newPassword: this.get('password'),
        }, function(error){
          if(error===null){
            console.log('Password changed successfully');
          } else {
            console.log('Error changing password:', error);
        }
      });
        // this.get('controllers.session').authUser(credentials).then(function(){
        //   console.log('there');
        //   that.transitionToRoute('swag');
        // });
      }


    }
  });
})();
