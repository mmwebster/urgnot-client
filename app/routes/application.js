// app/routes/application.js
import Ember from 'ember';

// Provides hooks and globals for all user auth and management

export default Ember.Route.extend({

  // User authentication control
  beforeModel: function(transition) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve) {
      _this.get("session").fetch().then(function(session) {

        // return session
        resolve(session);

      }, function() {

        // user not authenticated. transition to login if not accessing validUnauthTransition
        var validUnauthTransition = (transition.targetName == "index") || 
          (transition.targetName == "login");
        if(!validUnauthTransition) {
          _this.transitionTo("login");
        }

        // resolve promise
        resolve(false);
        
      });
    });
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
    }
  }
});
