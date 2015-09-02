import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  newRowName: null,
  actions: {
    newRow: function() {
      var uid = this.get('controllers.application.currentUser.uid');
      var _this = this;
      this.store.find('user', uid).then(function(user) {          // var user = 

        // split into email domain if possible
        var emailDomain = _this.get('newRowEmail');
        if(emailDomain.indexOf("@") != -1) {
          emailDomain = emailDomain.split('@')[1];
        }

        var newOrg = _this.store.createRecord('organization', {
          name: _this.get('newRowName'),
          email: emailDomain// remove the '@'
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
