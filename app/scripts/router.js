/* globals Application, Ember */

(function() {
  'use strict';

  Application.Router.map(function() {

    this.route('index', {
      path: '/'
    });

    this.resource('profile', {
      path: '/profile'
    }, function() {
      this.route('aversions');
      this.route('avatar');
      this.route('dates');
      this.route('interests');
      this.route('sizes');
    });

    this.route('swag', {
      path: '/myswag'
    });

    this.route('welcome', {
      path: '/welcome'
    });
  });

  Application.IndexRoute = Ember.Route.extend({

    renderTemplate: function() {
      this.render('index');

      this.render('login', {
        into: 'index',
        outlet: 'login',
        controller: 'login'
      });

      this.render('signup', {
        into: 'index',
        outlet: 'signup',
        controller: 'signup'
      });
    }
  });

  Application.ProfileRoute = Ember.Route.extend({

    renderTemplate: function() {
      this.render('profile');

      this.render('profile/dates', {
        into: 'profile',
        outlet: 'dates',
      });

    }
  });









})();
