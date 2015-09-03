// app/controllers/application.js
import Ember from 'ember';

// Provides hooks and globals for all user auth and management

export default Ember.Controller.extend({
  currentUser: function() {
    var userData = this.get('session').content;
    if (userData.isAuthenticated && typeof(userData.uid) != "undefined") {
      // this.toggleProperty('updateData');
      return {
        'uid': userData.uid,
        'email': userData.currentUser.email,
        'data': this.store.find('user', userData.uid)
      };
    } else {
      return null;
    }
  }.property('session.content.isAuthenticated'),

  // curentUserData: function() {
  //   debugger;
  //   return 
  // }.property('updateData')
});
