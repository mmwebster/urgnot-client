import Ember from 'ember';

/*
 * NOTES: Should abstract the various promises in the model out into the main body of the route 
 * */

export default Ember.Route.extend({
  model: function() {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve) {
      var model = {};
      var uid = _this.controllerFor('application').get('currentUser.uid');
      // GET USER
      _this.store.find('user', uid).then(function(user) {
        // SET USER
        model.user = user;
        // GET ORGANIZATION
        _this.store.find('organization', user.get('activeOrganizationId')).then(function(org) {
          // SET ORGANIZATION
          model.org = org;
          if (user.get('activeProjectId')) {
            // GET PROJECT
            _this.store.find('project', user.get('activeProjectId')).then(function(project) {
              // SET PROJECT
              model.project = project;
              resolve(model);
            });
          } else if (user.get('typeIsAdmin')) {
            // ADMIN, NO PROJECT
            alert("Select a project in the settings to view a student's dashboard.");
            model.adminPanel = true;
            resolve(model);
          } else {
            // CREATE PROJECT
            alert("Welcome to Urgnot!"); // temp welcome message
            var newProject = _this.store.createRecord('project', {
              name: "My 2015-2016 ISEF Project",
              author: user,
              organization: org
            });
            user.get('projects').addObject(newProject);
            var saved = newProject.save().then(function(project) {
              model.project = project;
              user.set('activeProjectId', project.get('id'));
              return user.save();
            });
            saved.then(function(some) {
              resolve(model);
            });
          }
        });
      });
    });
  }
});
