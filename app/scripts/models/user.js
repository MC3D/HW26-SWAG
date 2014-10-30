/*globals Application, DS */

(function () {
  'use strict';

  Application.User = DS.Model.extend({
    username: DS.attr('string'),
    email: DS.attr('string'),

    birthday: DS.attr('date'),
    anniversary: DS.attr('date'),

    beltsize: DS.attr('string'),
    hatsize: DS.attr('string'),
    pantsize: DS.attr('string'),
    ringsize: DS.attr('string'),
    shirtsize: DS.attr('string'),
    shoesize: DS.attr('string'),

    interests: DS.attr('string'),

    aversions: DS.attr('string')

  });

})();
