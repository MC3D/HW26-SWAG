/*globals Application, DS */

(function () {
  'use strict';

  Application.User = DS.Model.extend({
  interest: DS.attr('string')
});

})();
