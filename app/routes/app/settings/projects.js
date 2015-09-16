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
        if (user.get('typeIsAdmin')) {
          // USER ADMIN : get all projects associated with the user's currently active organization
          _this.store.find('project', {
            orderBy: 'organization',
            equalTo: user.get('activeOrganizationId')
          }).then(function(projects) {
            model.projects = projects;
            resolve(model);
          });
        } else {
          // USER STUDENT : get the projects created by this user
          _this.store.find('project', {
            orderBy: 'author',
            equalTo: user.get('id'),
          }).then(function(projects) {
            model.projects = projects;
            resolve(model);
          });
        }
      });
    });

    // var uid = this.controllerFor('application.currentUser.uid');
    // return this.store.find('project', {
    //   orderBy: author,
    //   equalTo: uid
    // });
  }
});
