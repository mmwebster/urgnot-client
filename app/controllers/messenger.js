import Ember from 'ember';

export default Ember.Controller.extend({
  updates: -1,
  uid: function() {
    return this.get('controllers.application.currentUser.uid');
  }.property(),
  threadFocused: false,
  thread: null,
  messages: function() {
    return this.get('thread.messages');
  }.property('threadFocused','thread'),

  needs: ['application'],
  data: function() {
  }.property(),
       
  modelIsUpdated: function() {
  }.property('threads'),

  initController: function() {
    var _this = this;
    var uid = this.get('uid');
    
    // Need to figure out how to filter by user/project/organization
    this.store.find('thread', {
    }).then(function(threads) {
      _this.set('threads', threads);
    });
  }.on("init"),

  actions: {
    createThread: function() {
      var _this = this;
      var newThread = this.store.createRecord('thread', {
        name: this.get('uid')
      });
      this.store.find('user', this.get('uid')).then(function(user) {
        newThread.get('endUser').addObject(user);
        user.save().then(function() {
          return newThread.save();
        });
      });
    },
    createMessage: function() {
      
    },
    focusThread: function(thread) {
      this.set('threadFocused', true);
      this.set('thread', thread);
    }
  }
});
