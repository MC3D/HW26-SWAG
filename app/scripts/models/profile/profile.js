/*globals Application, DS */

(function () {
  'use strict';

  Application.User = DS.Model.extend({

  birthday: DS.attr('date'),
  anniversary: DS.attr('date'),

  beltsize: DS.attr('string'),
  hatsize: DS.attr('string'),
  pantsize: DS.attr('string'),
  ringsize: DS.attr('string'),
  shirtsize: DS.attr('string'),
  shoesize: DS.attr('string'),

  interest: DS.attr('string'),

  aversion: DS.attr('string')


});

})();
