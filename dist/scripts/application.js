/* globals Ember, Application, DS, Firebase, filepicker */

(function() {
  'use strict';

  window.Application = Ember.Application.create({
    LOG_TRANSITIONS: true
  });

  Application.ref = new Firebase('https://myswag.firebaseio.com/');

  Application.ApplicationAdapter = DS.FirebaseAdapter.extend({
    firebase: Application.ref
  });

  filepicker.setKey('AZCePNZlYTB2qdKHk2cOiz');

  Ember.Application.initializer({
    name: 'firebase-session',

    initialize: function(container, application) {
      var token = localStorage.getItem('firebasetoken');
      if (token) {
        application.deferReadiness();
        var session = container.lookup('controller:session');
        session.authWithToken(token).finally(function() {
          application.advanceReadiness();
        }).catch(function(error){
          console.error(error);
        }).then(function(){
          console.log('success');
        });

      }
    }
  });
})();

/* globals Application, Ember */

(function() {
  'use strict';

  Application.VerifyUser = Ember.Mixin.create({
    beforeModel: function() {
      var user = this.controllerFor('session').get('currentUser');
      if (!user) {
        this.transitionTo('index');
      }
    },
  });


})();

/* globals Application, Ember */

(function() {
  'use strict';

  Application.Router.map(function() {

    this.route('index', {
      path: '/'
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

    this.route('welcome', {
      path: '/welcome'
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

      this.render('signup', {
        into: 'index',
        outlet: 'signup',
        controller: 'signup'
      });
    }
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

/* globals Application, Ember */

(function () {
  'use strict';

  Application.ApplicationController = Ember.Controller.extend({
    needs: ['session'],
    currentUser: Ember.computed.alias('controllers.session.currentUser'),

    actions: {
      logOut: function() {
        //this.transitionToRoute('index');
        localStorage.removeItem('firebasetoken');
        Application.reset();
        var dataRef = Application.ref;
        dataRef.unauth();
      },

      goToSwag: function() {
        this.transitionToRoute('swag');
      },

      goToFriends: function() {
        this.transitionToRoute('friends');
      },

      goToProfile: function() {
        this.transitionToRoute('profile.avatar');
      }
    }
});
})();

/* globals Application, Ember */

(function() {
  'use strict';

  Application.IndexController = Ember.Controller.extend({
    // needs: ['application'],
    // currentUser: Ember.computed.alias('controllers.application.currentUser'),


  });

})();

/* globals Application, Ember */

(function() {
  'use strict';
  Application.LoginController = Ember.Controller.extend({
    needs: ['session'],

    actions: {
      logIn: function() {
        var that = this;
        var credentials = this.getProperties('email', 'password');
        this.get('controllers.session').authUser(credentials).then(function(){
          console.log('there');
          that.transitionToRoute('swag');
        });
      },
    }
  });
})();

/* globals Application, Ember */

(function() {
  'use strict';

  Application.SearchController = Ember.ArrayController.extend({
    sortProperties: ['username'],
    sortAscending: true,

  });

  Application.SearchItemController = Ember.ObjectController.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {
      addFriend: function() {
        var user = this.get('model');

        this.get('currentUser').get('friends').addObject(user);
        this.get('currentUser').save();

        user.get('friends').addObject(this.get('currentUser'));
        user.save();
      }
    }
  });


})();

/* globals Application, Ember */

(function() {
  'use strict';

  Application.SessionController = Ember.Controller.extend({
    needs: ['application'],
    currentUser: null,

    authUser: function(credentials) {
      var that = this;
      return new Ember.RSVP.Promise(function(resolve, reject) {
        Application.ref.authWithPassword(
          credentials,
          function(error, authData) {
            if (error === null) {
              that.setStorage(authData).then(resolve, reject);
            } else {
              console.log('error in Session Controller authUser');
            }
        });
      });
    },

    setStorage: function(authData) {
      var that = this;
      return new Ember.RSVP.Promise(function(resolve, reject) {
        localStorage.setItem('firebasetoken', authData.token);
        console.log('About to find user', authData.uid);
        that.store.find('user', authData.uid).then(function(user) {
            console.log('User:', user);
            that.set('currentUser', user);
            resolve(user);
          },
          function(error) {
            // The user wasn't found, so I must create it
            // if (error === null) {
              console.error('Not found', error);
              /////////////////////////////////////////////////////////////////set username here
              var user = that.store.recordForId('user', authData.uid);
              if(user){
                user.loadedData();
                that.set('currentUser', user);
                resolve(user);
              } else {
                reject();
              }
          });
      });
    },

    authWithToken: function(token) {
      var that = this;
      return new Ember.RSVP.Promise(function(resolve, reject) {
        Application.ref.authWithCustomToken(token, function(error, authData) {
          if (error === null) {
            that.setStorage(authData).then(resolve, reject);
            console.log('Login Succeeded!', authData);
          } else {
            reject(error);
            console.log('Login Failed!', error);
            console.log('Error authenticating user:', error);
          }
        });
      });
    }


  });
})();

/* globals Application, Ember */

(function() {
  'use strict';

  Application.SignupController = Ember.ArrayController.extend({
    needs: ['session'],

    actions: {
      signUp: function() {
        var that = this;
        var credentials = this.getProperties('email', 'password');

        Application.ref.createUser(credentials, function(error) {
          if (! error) {
            that.get('controllers.session').authUser(credentials).then(function(user) {
              console.log('here it is');
              user.setProperties({
                username: that.get('username'),
                email: that.get('email')
              });
              user.save().then(function() {
                console.log('User created successfully');
                that.transitionToRoute('profile.avatar');
              });
            });
          } else {
            console.log('Error creating user:', error);
          }
        });
      }
    }
  });
})();

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

/* globals Application, Ember */

(function() {
  'use strict';

  Application.WelcomeController = Ember.ArrayController.extend({
    actions: {
      welcome: function() {
        var self = this;
        self.transitionToRoute('profile.dates');
      }
    }
  });


})();

/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileAversionsController = Ember.Controller.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {

      addAversion: function() {
        var aversion = this.store.createRecord('aversion', {
           aversionText: this.get('aversionText')
         });

        this.get('currentUser').get('aversions').addObject(aversion);
        this.get('currentUser').save();
      },
    }
  });


  Application.AversionController = Ember.ObjectController.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {
      removeAversion: function(){

      var user = this.get('currentUser');
      user.get('aversions').removeObject(this.get('model'));
      user.save();

        // this.get('model').destroyRecord();
        // console.log(this.get('currentUser'));
        //
        // this.get('curentUser').save().catch(function(error){
        //   console.log(error);
        // });

      }
    }
  });
})();

/* globals Application, Ember, filepicker */

(function() {
  'use strict';

  Application.ProfileAvatarController = Ember.Controller.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {

      addAvatar: function() {
        var that = this;

        filepicker.pickAndStore({},{},function(Blobs){
          that.set('currentUser.imgURL', Blobs[0].url);
        });
      },

       updateProfile: function() {
         this.get('currentUser').save();
         window.alert('Profile Picture Saved');
       }
    }
  });
})();

/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileDatesController = Ember.Controller.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {
      updateProfile: function() {
        this.get('currentUser').save();
        window.alert('Dates Saved');
      }
    }
  });
})();

/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileInterestsController = Ember.Controller.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {

      addInterest: function() {
        var interest = this.store.createRecord('interest', {
           interestText: this.get('interestText')
         });
         console.log(interest);
        this.get('currentUser').get('interests').addObject(interest);
        this.get('currentUser').save();
      },
    }
  });


  Application.InterestController = Ember.ObjectController.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {
      removeInterest: function(){

      var user = this.get('currentUser');
      user.get('interests').removeObject(this.get('model'));
      user.save();

      }
    }
  });
})();

/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileIndexController = Ember.ArrayController.extend({
    needs: ['application'],


    actions: {


    }
  });

})();

/* globals Application, Ember */

(function() {
  'use strict';

  Application.ProfileSizesController = Ember.Controller.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {
      updateProfile: function() {
        this.get('currentUser').save();
        window.alert('Sizes Saved');
      }
    }
  });
})();

/* globals Application, Ember */

(function() {
  'use strict';

  Application.FriendsIndexController = Ember.ArrayController.extend({
    sortProperties: ['username'],
    sortAscending: true,

    actions: {
      findFriends: function() {
        this.transitionToRoute('search');
      },
    }
  });

  Application.FriendsItemController = Ember.ObjectController.extend({
    needs: ['application'],
    currentUser: Ember.computed.alias('controllers.application.currentUser'),

    actions: {
      removeFriend: function() {
        var user = this.get('model');

        this.get('currentUser').get('friends').removeObject(user);
        this.get('currentUser').save();

        user.get('friends').removeObject(this.get('currentUser'));
        user.save();
      },
    }
  });
})();

/*globals Application, DS */

(function () {
  'use strict';

  Application.Aversion = DS.Model.extend({
    aversionText: DS.attr('string')
  });

})();

/*globals Application, DS */

(function () {
  'use strict';

  Application.Interest = DS.Model.extend({
    interestText: DS.attr('string')
  });

})();

/*globals Application, DS */

(function () {
  'use strict';

  Application.User = DS.Model.extend({

    username: DS.attr('string'),
    email: DS.attr('string'),

    imgURL: DS.attr('string'),

    birthday: DS.attr('string'),
    anniversary: DS.attr('string'),

    beltSize: DS.attr('string'),
    hatSize: DS.attr('string'),
    pantSize: DS.attr('string'),
    shirtSize: DS.attr('string'),
    shoeSize: DS.attr('string'),

    interests: DS.hasMany('interest', {embedded: true}),

    aversions: DS.hasMany('aversion', {embedded: true}),

    swagbag: DS.hasMany('swag', {async: true}),

    friends: DS.hasMany('user', {async: true}),
  });

})();

/*globals Application, DS */

(function() {
  'use strict';

  Application.Swag = DS.Model.extend({
    swagURL: DS.attr('string'),
    description: DS.attr('string'),
    retailer: DS.attr('string'),
    location: DS.attr('string'),
    price: DS.attr('string')
  });

})();

Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class='header'>\n  <a href=# class=\"octicon octicon-gist-secret\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "goToSwag", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n    <span class='navigation'>MY SWAG</span>\n  </a>\n\n  <a href=# class=\"octicon octicon-organization\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "goToFriends", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n    <span class='navigation'>FRIENDS</span>\n  </a>\n\n  <a href=# class='octicon octicon-gear' ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "goToProfile", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n    <span class='navigation'>SETTINGS</span>\n  </a>\n\n  <a href=# class=\"octicon octicon-sign-out\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "logOut", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n    <span class='navigation'>SIGN OUT</span>\n  </a>\n</div>\n\n<div>\n    ");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>\n");
  return buffer;
  
});
Ember.TEMPLATES["index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<form class='index'>\n\n  <div class='brand'>\n    <h1>SWAGGER</h1>\n    <p class='tagline'>Your style. A perfect fit.</p>\n  </div>\n\n  <div class='container'>\n\n    <div class='login'>\n      ");
  data.buffer.push(escapeExpression((helper = helpers.outlet || (depth0 && depth0.outlet),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "login", options) : helperMissing.call(depth0, "outlet", "login", options))));
  data.buffer.push("\n    </div>\n\n    <div class='signup'>\n      ");
  data.buffer.push(escapeExpression((helper = helpers.outlet || (depth0 && depth0.outlet),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "signup", options) : helperMissing.call(depth0, "outlet", "signup", options))));
  data.buffer.push("\n    </div>\n\n  </div>\n</form>\n");
  return buffer;
  
});
Ember.TEMPLATES["login"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("email"),
    'class': ("input email"),
    'value': ("email"),
    'placeholder': ("Email")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("password"),
    'class': ("input password"),
    'value': ("password"),
    'placeholder': ("Password")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n<input class='btn btn-success' value='Log In' ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "logIn", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n");
  return buffer;
  
});
Ember.TEMPLATES["profile"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<form class='profile'>\n  ");
  data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data},helper ? helper.call(depth0, "Profile Picture", "profile.avatar", options) : helperMissing.call(depth0, "link-to", "Profile Picture", "profile.avatar", options))));
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data},helper ? helper.call(depth0, "Important Dates", "profile.dates", options) : helperMissing.call(depth0, "link-to", "Important Dates", "profile.dates", options))));
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data},helper ? helper.call(depth0, "Interests", "profile.interests", options) : helperMissing.call(depth0, "link-to", "Interests", "profile.interests", options))));
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data},helper ? helper.call(depth0, "Aversions", "profile.aversions", options) : helperMissing.call(depth0, "link-to", "Aversions", "profile.aversions", options))));
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data},helper ? helper.call(depth0, "Just My Size", "profile.sizes", options) : helperMissing.call(depth0, "link-to", "Just My Size", "profile.sizes", options))));
  data.buffer.push("\n</form>\n\n");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});
Ember.TEMPLATES["search"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n    <ul>\n        <li>\n          <p>");
  stack1 = helpers._triageMustache.call(depth0, "username", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</p>\n          <img class='imgAvatar' ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'src': ("imgURL")
  },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(" />\n          <button class='btn btn-info'");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "addFriend", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">Add Friend</button>\n        </li>\n    </ul>\n  ");
  return buffer;
  }

  data.buffer.push("<form class='search'>\n  <h2>Find Friends</h2>\n\n  ");
  stack1 = helpers.each.call(depth0, "arrangedContent", {hash:{
    'itemController': ("SearchItem")
  },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</form>\n\n<form class='filter'>\n  Name\n  Email\n</form>\n");
  return buffer;
  
});
Ember.TEMPLATES["signup"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<h2>New to Swag?<span>Join today!</span></h2>\n");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'class': ("input"),
    'value': ("username"),
    'placeholder': ("User Name")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("email"),
    'class': ("input"),
    'value': ("email"),
    'placeholder': ("Email")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("password"),
    'class': ("input"),
    'value': ("password"),
    'placeholder': ("Password")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n<input class='btn btn-info' value='Sign up for Swagger' ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "signUp", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n");
  return buffer;
  
});
Ember.TEMPLATES["swag"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n      <img class='imgswag' ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'src': ("swagURL")
  },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(" />\n      <ul>\n        <li class='data'>");
  stack1 = helpers._triageMustache.call(depth0, "description", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n        <li class='data'>");
  stack1 = helpers._triageMustache.call(depth0, "retailer", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n        <li class='data'>");
  stack1 = helpers._triageMustache.call(depth0, "location", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n        <li class='data'>");
  stack1 = helpers._triageMustache.call(depth0, "price", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n        <li><button class='btn btn-danger'");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "removeSwag", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">REMOVE ITEM</button></li>\n      </ul>\n    ");
  return buffer;
  }

  data.buffer.push("<form class='addswag'>\n  <h2>Add Swag Bag Items</h2>\n\n    <div class='image'>\n      <img class='imgswag'");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'src': ("swagURL")
  },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "addImage", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push("/>\n    </div>\n\n    <div class='data'>\n      ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'class': ("input description"),
    'value': ("description"),
    'placeholder': ("Item Description")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n      ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'class': ("input"),
    'value': ("retailer"),
    'placeholder': ("Store")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n      ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'class': ("input"),
    'value': ("location"),
    'placeholder': ("Store Location")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n      ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'class': ("input"),
    'value': ("price"),
    'placeholder': ("Price")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n      <button class='btn btn-success' ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "saveSwag", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">ADD ITEM</button>\n    </div>\n</form>\n\n<form class='swagbag'>\n  <h2>Current Swag Bag</h2>\n  <div class='item'>\n    ");
  stack1 = helpers.each.call(depth0, "currentUser.swagbag", {hash:{
    'itemController': ("SwagItem")
  },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </div>\n</form>\n");
  return buffer;
  
});
Ember.TEMPLATES["welcome"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', escapeExpression=this.escapeExpression;


  data.buffer.push("<h2>Welcome to Swag!</h2>\n<input class='btn btn-success' value='Continue' ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "welcome", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\n");
  return buffer;
  
});
Ember.TEMPLATES["profile/aversions"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n  <li>");
  stack1 = helpers._triageMustache.call(depth0, "aversionText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    <button class='btn btn-danger'");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "removeAversion", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">X</button>\n  </li>\n");
  return buffer;
  }

  data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data},helper ? helper.call(depth0, "Back", "profile.interests", options) : helperMissing.call(depth0, "link-to", "Back", "profile.interests", options))));
  data.buffer.push("\n");
  data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data},helper ? helper.call(depth0, "Next", "profile.sizes", options) : helperMissing.call(depth0, "link-to", "Next", "profile.sizes", options))));
  data.buffer.push("\n\n<label>Add Aversion</label>\n\n");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("string"),
    'class': ("create-user-input"),
    'value': ("aversionText"),
    'placeholder': ("aversion")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n<button class='btn btn-info'");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "addAversion", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">Add</button>\n");
  stack1 = helpers.each.call(depth0, "currentUser.aversions", {hash:{
    'itemController': ("aversion")
  },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});
Ember.TEMPLATES["profile/avatar"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n    <img class='imgavatar' ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'src': ("currentUser.imgURL")
  },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(" />\n    <button class='btn btn-warning' ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "addAvatar", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push("><i></i>Change Photo</button>\n  ");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\n    <button class='btn btn-warning' ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "addAvatar", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push("><i></i>Add Photo</button>\n  ");
  return buffer;
  }

  data.buffer.push("<form class='addavatar'>\n  <h1>Profile Picture</h1>\n  ");
  data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data},helper ? helper.call(depth0, "Next", "profile.dates", options) : helperMissing.call(depth0, "link-to", "Next", "profile.dates", options))));
  data.buffer.push("\n\n  ");
  stack1 = helpers['if'].call(depth0, "currentUser.imgURL", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n  <button class='btn btn-info' ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "updateProfile", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">Update</button>\n</form>\n");
  return buffer;
  
});
Ember.TEMPLATES["profile/dates"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<form class='adddates'>\n  <h2>Important Dates</h2>\n  ");
  data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data},helper ? helper.call(depth0, "Back", "profile.avatar", options) : helperMissing.call(depth0, "link-to", "Back", "profile.avatar", options))));
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data},helper ? helper.call(depth0, "Next", "profile.interests", options) : helperMissing.call(depth0, "link-to", "Next", "profile.interests", options))));
  data.buffer.push("\n  <label>Birthday</label>\n  ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'class': ("create-user-input birthday"),
    'value': ("currentUser.birthday"),
    'placeholder': ("birthday")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n  <label>Anniversary</label>\n  ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("text"),
    'class': ("create-user-input anniversary"),
    'value': ("currentUser.anniversary"),
    'placeholder': ("anniversary")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n\n  <button class='btn btn-info'");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "updateProfile", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">Update</button>\n</form>\n");
  return buffer;
  
});
Ember.TEMPLATES["profile/interests"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n    <li>\n      ");
  stack1 = helpers._triageMustache.call(depth0, "interestText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </li>\n    <button ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "removeInterest", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">Delete Item</button>\n  ");
  return buffer;
  }

  data.buffer.push("<form class='addinterests'>\n  <label>Add Interest</label>\n  ");
  data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data},helper ? helper.call(depth0, "Back", "profile.dates", options) : helperMissing.call(depth0, "link-to", "Back", "profile.dates", options))));
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data},helper ? helper.call(depth0, "Next", "profile.aversions", options) : helperMissing.call(depth0, "link-to", "Next", "profile.aversions", options))));
  data.buffer.push("\n  ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("string"),
    'class': ("create-user-input"),
    'value': ("interestText"),
    'placeholder': ("interest")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n  <button class='btn btn-info'");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "addInterest", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">Add Interest</button>\n</form>\n\n<form class='interests'>\n  ");
  stack1 = helpers.each.call(depth0, "currentUser.interests", {hash:{
    'itemController': ("interest")
  },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</form>\n");
  return buffer;
  
});
Ember.TEMPLATES["profile/sizes"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  data.buffer.push("<form class='addsizes'>\n\n");
  data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data},helper ? helper.call(depth0, "Back", "profile.aversions", options) : helperMissing.call(depth0, "link-to", "Back", "profile.aversions", options))));
  data.buffer.push("\n");
  data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data},helper ? helper.call(depth0, "Next", "swag", options) : helperMissing.call(depth0, "link-to", "Next", "swag", options))));
  data.buffer.push("\n\n  <label>Hat Size</label>\n  ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("string"),
    'class': ("create-user-input"),
    'value': ("currentUser.hatSize"),
    'placeholder': ("hat size")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n  <label>Shirt Size</label>\n  ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("string"),
    'class': ("create-user-input"),
    'value': ("currentUser.shirtSize"),
    'placeholder': ("shirt size")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n  <label>Pant Size</label>\n  ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("string"),
    'class': ("create-user-input"),
    'value': ("currentUser.pantSize"),
    'placeholder': ("pant size")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n  <label>Shoe Size</label>\n  ");
  data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
    'type': ("string"),
    'class': ("create-user-input"),
    'value': ("currentUser.shoeSize"),
    'placeholder': ("shoe size")
  },hashTypes:{'type': "STRING",'class': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'type': depth0,'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n\n  <button class='btn btn-info'");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "updateProfile", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">Update</button>\n</form>\n");
  return buffer;
  
});
Ember.TEMPLATES["friends/index"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n      <ul>\n        <li>\n          <p>");
  stack1 = helpers._triageMustache.call(depth0, "username", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</p>\n          <img class='imgAvatar' ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'src': ("imgURL")
  },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(" />\n          ");
  data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
    'class': ("btn")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[depth0,depth0,depth0],types:["STRING","STRING","ID"],data:data},helper ? helper.call(depth0, "View Swag", "friends.show", "", options) : helperMissing.call(depth0, "link-to", "View Swag", "friends.show", "", options))));
  data.buffer.push("\n          <button class='btn btn-warning'");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "removeFriend", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">Remove Friend</button>\n        </li>\n      </ul>\n  ");
  return buffer;
  }

  data.buffer.push("<form class='friends'>\n  <button ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "findFriends", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push("><i></i>Find Friends</button>\n\n  <h2>My Friends</h2>\n\n  ");
  stack1 = helpers.each.call(depth0, "arrangedContent", {hash:{
    'itemController': ("FriendsItem")
  },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</form>\n");
  return buffer;
  
});
Ember.TEMPLATES["friends/show"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n      <li>");
  stack1 = helpers._triageMustache.call(depth0, "interestText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    ");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n      <li>");
  stack1 = helpers._triageMustache.call(depth0, "aversionText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    ");
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n      <img class='imgswag' ");
  data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
    'src': ("swagURL")
  },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
  data.buffer.push(" />\n      <ul>\n        <li class='data'>");
  stack1 = helpers._triageMustache.call(depth0, "description", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n        <li class='data'>");
  stack1 = helpers._triageMustache.call(depth0, "retailer", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n        <li class='data'>");
  stack1 = helpers._triageMustache.call(depth0, "location", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n        <li class='data'>");
  stack1 = helpers._triageMustache.call(depth0, "price", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n      </ul>\n    ");
  return buffer;
  }

  data.buffer.push("<form class=friends-profile>\n  <ul>\n    <li><label>Birthday:</label>");
  stack1 = helpers._triageMustache.call(depth0, "birthday", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    <li><label>Anniversary:</label>");
  stack1 = helpers._triageMustache.call(depth0, "anniversary", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n  </ul>\n\n  <ul>\n  ");
  stack1 = helpers.each.call(depth0, "interests", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </ul>\n\n  <ul>\n    ");
  stack1 = helpers.each.call(depth0, "aversions", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </ul>\n\n  <ul>\n    <li><label>Hat Size:</label>");
  stack1 = helpers._triageMustache.call(depth0, "hatSize", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    <li><label>Shirt Size:</label>");
  stack1 = helpers._triageMustache.call(depth0, "shirtSize", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    <li><label>Pant Size:</label>");
  stack1 = helpers._triageMustache.call(depth0, "pantSize", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n    <li><label>Shoe Size:</label>");
  stack1 = helpers._triageMustache.call(depth0, "shoeSize", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n  </ul>\n</form>\n\n\n\n<form class='swagbag'>\n  <h2>");
  stack1 = helpers._triageMustache.call(depth0, "username", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("'s Swag</h2>\n\n  <div class='item'>\n    ");
  stack1 = helpers.each.call(depth0, "swagbag", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n  </div>\n\n</form>\n");
  return buffer;
  
});