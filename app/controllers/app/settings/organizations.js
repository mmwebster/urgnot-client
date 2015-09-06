import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  newRowName: null,
  activeRowId: null,
  setup: Ember.on('init', function() {
    var _this = this;
    this.get('controllers.application.currentUser.data').then(function(data) {
      _this.set('activeRowId', data.get('activeOrganizationId'));
    });
  }),
  bufferedRows: Ember.computed('activeRowId', function() {
    var rows = this.get('model');
    var unselected = rows.rejectBy('id', this.get('activeRowId'));
    unselected.forEach(function(org) {
      org.set('showIsActive', false);
    });
    var selected = rows.filterBy('id', this.get('activeRowId'));
    if (selected[0]) {
      selected[0].set('showIsActive', true);
      Ember.debug('set \"' + selected[0].get('name') + '\" is active')
    }
    return rows;
  }),
  actions: {
    newRow: function() {
      var uid = this.get('controllers.application.currentUser.uid');
      var _this = this;
      this.store.find('user', uid).then(function(user) {          // var user = 

        // split into email domain if possible
        var emailDomain = _this.get('newRowEmail');
        if(emailDomain.indexOf("@") !== -1) {
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
    },
    // select active row
    selectActiveRow: function(row) {
      if (!row.get('showIsActive')) {
        var makeActive = confirm("Are you sure you want to make \"" + row.get('name') + "\" your active organization?");
        if(makeActive) {
          var _this = this;
          var uid = this.get('controllers.application.currentUser.uid');
          this.store.find('user', uid).then(function(user) {
            user.set('activeOrganizationId', row.get('id'));
            user.save().then(function(user) {
              _this.set('activeRowId', row.get('id'));
            });
          });
        }
      }
    }
  }
});
