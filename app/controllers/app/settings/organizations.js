import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  newRowName: null,
  actions: {
    newRow: function() {
      var uid = this.get('controllers.application.currentUser.uid');
      var _this = this;
      var user = this.store.find('user', uid).then(function(user) {
        var newOrg = _this.store.createRecord('organization', {
          name: _this.get('newRowName')
        });

        user.get('adminOrganizations').addObject(newOrg);

        newOrg.save().then(function() {
          return user.save();
        });
        _this.set('newRowName', null);
      });
    }
  }
});
