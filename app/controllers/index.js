import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({

  version: Ember.computed(function() {
    return config.version;
  }),

  actions: {
    start: function() {
      if (!this.get('session').content.isAuthenticated) {
        this.transitionToRoute("login");
      } else {
        this.transitionToRoute("app");
      }
    }
  }
});
