import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var _this = this;
    return new Promise(function(resolve) {
      var model = {};
      var uid = _this.controllerFor('application').get('currentUser.uid');
      _this.store.find('user', uid).then(function(user) {
        model.user = user;
        _this.store.find('project', user.get('activeProjectId')).then(function(project) {
          model.project = project;
          resolve(model);
        });
      });
    });
  }
});
