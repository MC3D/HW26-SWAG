/* globals Application, Ember */

(function() {
  'use strict';

  Application.Router.map(function() {

    this.route('index', {
      path: '/'
    });

    this.route('password', {
      path: '/resetpassword'
    });

    this.route('search', {
      path: '/searchpeople'
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

    this.resource('friends', {
      path: '/friends'
    }, function() {
      this.route('show', {
        path: ':user_id'
      });
    });

  });

  Application.FriendsIndexRoute = Ember.Route.extend(Application.VerifyUser, {

    model: function() {
      var currentUser = this.controllerFor('application').get('currentUser');
      return currentUser.get('friends');
    }
  });

  Application.FriendsShowRoute = Ember.Route.extend(Application.VerifyUser, {

  });

  Application.IndexRoute = Ember.Route.extend({

    renderTemplate: function() {
      this.render('index');

      this.render('login', {
        into: 'index',
        outlet: 'login',
        controller: 'login'
      });

      this.render('reset', {
        into: 'index',
        outlet: 'reset',
        controller: 'reset'
      });

      this.render('signup', {
        into: 'index',
        outlet: 'signup',
        controller: 'signup'
      });
    }
  });

  Application.PasswordRoute = Ember.Route.extend(Application.VerifyUser, {

  });

  Application.ProfileRoute = Ember.Route.extend(Application.VerifyUser, {

  });

  Application.ProfileAvatarRoute = Ember.Route.extend(Application.VerifyUser, {

  });


  Application.ProfileAversionsRoute = Ember.Route.extend(Application.VerifyUser, {

    model: function() {
      var id = this.controllerFor('application').get('currentUser').id;
      return this.store.find('user', id);
    }
  });

  Application.ProfileDatesRoute = Ember.Route.extend(Application.VerifyUser, {

  });

  Application.ProfileInterestsRoute = Ember.Route.extend(Application.VerifyUser, {

    model: function() {
      var id = this.controllerFor('application').get('currentUser').id;
      return this.store.find('user', id);
    }
  });

  Application.ProfileSizesRoute = Ember.Route.extend(Application.VerifyUser, {

  });

  Application.SearchRoute = Ember.Route.extend(Application.VerifyUser, {

    model: function() {
      var currentUser = this.controllerFor('application').get('currentUser');

      return Ember.RSVP.hash({
        friends: currentUser.get('friends.content.content'),
        users: this.store.find('user')
      }).then(function(hash) {
        var friends = hash.friends;
        var notFriends = hash.users;
        notFriends.removeObject(currentUser);
        notFriends.removeObjects(friends);
        return notFriends;
      });
    }
  });

  Application.SwagRoute = Ember.Route.extend(Application.VerifyUser, {

  });

})();
