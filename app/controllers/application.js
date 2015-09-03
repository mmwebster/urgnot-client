// app/controllers/application.js
import Ember from 'ember';

// Provides hooks and globals for all user auth and management

export default Ember.Controller.extend({
  currentUser: function() {
    var userData = this.get('session').content;
    if (userData.isAuthenticated && typeof(userData.uid) != "undefined") {
      var userRecord = this.store.find('user', userData.uid).then(function(user) {
        console.log('UPDATING USER');
      });
      return {
        'uid': userData.uid,
        'email': userData.currentUser.email,
        'data': userRecord,
      };
    } else {
      return null;
    }
  }.property('session.content.isAuthenticated'),
});
