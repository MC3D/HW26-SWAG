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

    aversions: DS.hasMany('aversion', {embedded: true})

  });

  Application.Interest = DS.Model.extend({
    interestText: DS.attr('string')
  });

  Application.Aversion = DS.Model.extend({
    aversionText: DS.attr('string')
  });

})();
