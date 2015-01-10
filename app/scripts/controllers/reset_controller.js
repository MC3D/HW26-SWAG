/* globals Application, Ember */

(function() {
  'use strict';
  Application.ResetController = Ember.Controller.extend({
    needs: ['session'],

    actions: {
      sendPasswordResetEmail: function() {
        Application.ref.resetPassword({
          email: this.get('email')
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
