import Ember from 'ember';

export default Ember.Route.extend({
  // unconditionally sign out if route entered
  beforeModel: function() {
    if (this.get('session').content.isAuthenticated) {
      var _this = this;
      this.get("session").close().then(function() {
        console.log('User signed out');
        _this.transitionTo('index');
      });
    } else {
      this.transitionTo('index');
    }
  }
});
