/*globals Application, DS */

(function() {
  'use strict';



  Application.Swag = DS.Model.extend({
    swagUrl: DS.attr('string'),
    item: DS.attr('string'),
    store: DS.attr('string'),
    price: DS.attr('string')
  });

})();
