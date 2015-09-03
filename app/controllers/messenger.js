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

  newThreadName: "",

  errorIsDisplayed: false,
  error: null,

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
      orderBy: 'date'
    }).then(function(threads) {
      _this.set('threads', threads);
    });
  }.on("init"),

  displayError: function(error) {
    this.set('errorIsDisplayed', true);
    this.set('error', error);
    var _this = this;
    Ember.run.later(function() {
      _this.set('errorIsDisplayed', false);
      _this.set('error', null);
    }, 3500);
  },

  actions: {
    createThread: function() {
      if(this.get('newThreadName') != "") {
        var _this = this;
        var date = -1 * Date.now();
        var newThread = this.store.createRecord('thread', {
          name: this.get('newThreadName'),
          date: date,
          authorUid: this.get('uid')
        });
        this.store.find('user', this.get('uid')).then(function(user) {
          newThread.get('endUser').addObject(user);
          user.save().then(function() {
            return newThread.save();
          });
        });
      } else {
        this.displayError("Subject cannot be empty");
      }
    },
    createMessage: function() {
      
    },
    focusThread: function(thread) {
      this.set('threadFocused', true);
      this.set('thread', thread);
    }
  }
});
