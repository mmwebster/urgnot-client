import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.findAll('project');
    // var uid = this.controllerFor('application.currentUser.uid');
    // return this.store.find('project', {
    //   orderBy: author,
    //   equalTo: uid
    // });
  }
});
