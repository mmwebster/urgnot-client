// app/controllers/application.js
import Ember from 'ember';

// Provides hooks and globals for all user auth and management

export default Ember.Controller.extend({
  currentUser: function() {
    var userData = this.get('session').content;
    if (userData.isAuthenticated) {
      return {
        'uid': userData.uid,
        'email': userData.currentUser.email
      };
    } else {
      return null;
    }
  }.property('session.content.isAuthenticated'),

  // perform UX functions upon change in path or auth status
  observeAuthentication: function() {
    debugger;
    if(!this.get('session').content.isAuthenticated) {
      this.transitionToRoute('application');
    }
  }.property('currentPath', 'session.content.isAuthenticated')
});
