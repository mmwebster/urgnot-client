import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    // var uid = this.controllerFor('application').get('currentUser.uid');
    // var _this = this;
    // var user = this.store.find('user', uid).then(function(user) {
    //   var newOrg = _this.store.createRecord('organization', {
    //     name: 'test 5'
    //   });
    //
    //   user.get('adminOrganizations').addObject(newOrg);
    //
    //   newOrg.save().then(function() {
    //     return user.save();
    //     debugger;
    //   });
    // });

    return this.store.findAll('organization');
  }
});
