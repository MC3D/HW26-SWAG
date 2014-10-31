/*globals Application, DS */

(function () {
  'use strict';

  Application.User = DS.Model.extend({

  birthday: DS.attr('date'),
  anniversary: DS.attr('date')

});

})();
