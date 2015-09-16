import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var _this = this;
    var model = {};
    // Get all projects visible to user type (student/admin)
    return new Ember.RSVP.Promise(function(resolve) {
      var uid = _this.controllerFor('application').get('currentUser.uid');
      _this.store.find('user', uid).then(function(user) {
        model.user = user;
        _this.store.findAll('organization').then(function(orgs) {
          model.orgs = orgs;
          resolve(model);
        });
      });
    });
  }
});
