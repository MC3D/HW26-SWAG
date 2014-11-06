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
