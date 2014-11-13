/* globals Application, Ember */

(function() {
  'use strict';

  Application.FriendsShowController = Ember.Controller.extend({
    birthday: 'Birthday:',
    anniversary: 'Anniversary:',
    hatSize: 'Hat Size:',
    shirtSize: 'Shirt Size:',
    pantSize: 'Pant Size:',
    shoeSize: 'Shoe Size:',
    avone: 'Purple',
    avtwo: 'Sugar Candy',
    intone: 'Caramel',
    inttwo: 'Dinosaurs',
    intthree: 'Sushi',

    dates: Ember.computed.collect('birthday','model.birthday','anniversary','model.anniversary'),
    sizes: Ember.computed.collect('hatSize','model.hatSize','shirtSize', 'model.shirtSize', 'pantSize','model.pantSize','shoeSize' ,'model.shoeSize'),
    aversions: Ember.computed.collect('avone','avtwo'),
    interests: Ember.computed.collect('intone','inttwo','intthree'),
  });

})();
