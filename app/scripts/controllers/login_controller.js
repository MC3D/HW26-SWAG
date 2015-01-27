/* globals Application, Ember */

(function() {
  'use strict';
  Application.LoginController = Ember.Controller.extend({
    needs: ['session'],
    isVisible: true,

    actions: {
      logIn: function() {
        var that = this;
        var credentials = this.getProperties('email', 'password');
        this.get('controllers.session').authUser(credentials).then(function(){
          console.log('there');
          that.transitionToRoute('swag');
        });
      },

      toggle: function() {
        this.toggleProperty('isVisible');
      },
      
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
      },
    }
  });
})();
