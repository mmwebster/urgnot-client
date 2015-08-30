import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    return this.get("session").fetch().catch(function() {});
  },
  model: function() {
    var uid = this.controllerFor('application').get('currentUser.uid');
    return this.store.find('user', uid);
  },
});
