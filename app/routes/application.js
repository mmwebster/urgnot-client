// app/routes/application.js
import Ember from 'ember';

// Provides hooks and globals for all user auth and management

export default Ember.Route.extend({

  beforeModel: function() {
    return this.get("session").fetch().catch(function() {});
  },

  actions: {
    signOut: function() {
      if (this.get('session').content.isAuthenticated) {
        this.get("session").close().then(function() {
          console.log('User signed out');
        });
      } else {
        console.warn('User already signed out');
      }
    }
  }
});
