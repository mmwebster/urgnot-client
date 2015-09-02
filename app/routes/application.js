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
        var signOut = confirm("Are you sure you want to sign out?");
        if(signOut) {
          var _this = this;
          this.get("session").close().then(function() {
            console.log('User signed out');
            _this.transitionTo('index');
          });
        }
      } else {
        console.warn('User already signed out');
        this.transitionTo('index');
      }
    },
    willTransition: function() {
      // prevent un auth'ed clients attempt to access auth requiring routes
      if(!this.get('session').content.isAuthenticated) {
        this.transitionTo('application');
      }
    },
    didTransition: function() {
      // prevent un auth'ed clients attempt to access auth requiring routes
      if(!this.get('session').content.isAuthenticated) {
        this.transitionTo('application');
      }
    }
  }
});
