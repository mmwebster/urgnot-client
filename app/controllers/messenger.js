import Ember from 'ember';

export default Ember.Controller.extend({
  updates: -1,
  needs: ['application'],
  data: function() {
  }.property(),
       
  modelIsUpdated: function() {
    debugger;
  }.property('threads'),

  initController: function() {
    debugger;
    var _this = this;
    
    this.store.find('user', this.get('controllers.application.currentUser.uid')).then(function(user) {
      _this.set('newModel', user);
    });
  }.on("init")
});
