/*globals Application, DS */

(function () {
  'use strict';

  Application.User = DS.Model.extend({
    
    username: DS.attr('string'),
    email: DS.attr('string'),

    birthday: DS.attr('string'),
    anniversary: DS.attr('string'),

    beltSize: DS.attr('string'),
    hatSize: DS.attr('string'),
    pantSize: DS.attr('string'),
    shirtSize: DS.attr('string'),
    shoeSize: DS.attr('string'),

    interests: DS.attr('string'),

    aversions: DS.attr('string')

  });

})();
