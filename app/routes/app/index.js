import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var uid = this.controllerFor('application').get('currentUser.uid');
    return this.store.find('user', uid);
  }
});
