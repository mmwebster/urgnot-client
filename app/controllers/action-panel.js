import Ember from 'ember';

export default Ember.Controller.extend({
  application: Ember.inject.controller('application'),
  user: Ember.computed('application.currentUser', function() {
    return this.get('application.currentUser');
  })
});
