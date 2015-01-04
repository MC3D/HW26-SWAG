/* globals Application, Ember */

(function() {
  'use strict';

    Application.PasswordController = Ember.Controller.extend({
    needs: ['session'],

    actions: {
      resetPassword: function() {
        // var that = this;
        // var credentials = this.getProperties('email', 'password');

        Application.ref.changePassword({
          email: 'enter text',
          oldPassword: 'enter text',
          newPassword: 'enter text',
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
      },

      sendPasswordResetEmail: function() {
        Application.ref.resetPassword({
          email: 'email address'
        }, function(error){
          if (error===null){
            console.log('Password reset email sent successfully');
          } else {
            console.log('Error sending password reset email:', error);
          }
      });
      }
    }
  });
})();
