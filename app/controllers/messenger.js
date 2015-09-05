import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  updates: -1,
  uid: function() {
    return this.get('controllers.application.currentUser.uid');
  }.property(),
  threadFocused: false,

  messages: Ember.computed('threadFocused', 'thread', 'thread.messages.length', 'updateMessagesToggle', function(key, value) {
    // auto scroll and other func.s that required to be in messages
    if (this.get('threadFocused')) {
      Ember.debug('In messages');
      var scrollheight = $(".messenger .messages .messages-body")[0].scrollHeight;
      $(".messenger .messages .messages-body").animate({ scrollTop: scrollheight}, 600)
    }
    // func.s that simply require a thread to be defined
    if (this.get('thread')) {
      var messages = this.get('thread.messages');
      Ember.debug('Updated messages: ' + messages);
      return messages;
    } else {
      return [{'body': 'No messages'}];
    }
  }),

  // prepares a scroll to be made, uses a 300ms buffer to prevent scroll spaming
  autoScrollBuffer: function() {
    this.set('autoScrollPrepared', true);
  }.observes('thread.messages.@each.body'),

  autoScrollPrepared: false,
  autoScroll: function() {
    var _this = this;
    Ember.run.later(function() {
      // autoscroll new messages
      Ember.debug('making scroll');
      var scrollheight = $(".messenger .messages .messages-body")[0].scrollHeight;
      $(".messenger .messages .messages-body").animate({ scrollTop: scrollheight}, 600)
      // clear prep buffer;
      _this.set('autoScrollPrepared', false);
    }, 300);
  }.observes('autoScrollPrepared'),

  updateMessagesToggle: false,

  newThreadName: "",
  currentThread: "",

  errorIsDisplayed: false,
  error: null,

  data: function() {
  }.property(),
       
  modelIsUpdated: function() {
  }.property('threads'),

  autoscrollMessages: function() {
  }.property('messages'),

  initController: function() {
    var _this = this;
    var uid = this.get('uid');
    
    // Need to figure out how to filter by user/project/organization
    this.store.find('thread', {
      orderByChild: 'date'
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
        this.set('newThreadName', "");
      } else {
        this.displayError("Subject cannot be empty");
      }
    },
    createMessage: function() {
      // retrieve message, then nullify
      var body = this.get('newMessageBody');
      this.set('newMessageBody', "");
      var _this = this;
      var author = this.get('controllers.application.currentUser.data');

      // send along the message to thread
      author.then(function(_author) {
        var date = Date.now();
        var newMessage = _this.store.createRecord('message', {
          author: _author,
          date: date,
          body: body
        });

        var thread = _this.get('currentThread');
        newMessage.set('thread', thread);
        thread.save().then(function() {
          return newMessage.save();
        });

        Ember.debug('INSERTED: author: ' + _author + ', date: ' + date + ', body: ' + body);
        _this.toggleProperty('updateMessagesToggle');
        
        Ember.debug('In end of createMessage');
      });
    },
    focusThread: function(thread) {
      this.set('threadFocused', true);
      this.set('thread', thread);
      this.set('displayThreadTitle', true);
      this.set('currentThread', thread);
    },
    blurThread: function() {
      this.set('threadFocused', false);
      this.set('displayThreadTitle', false);
    }
  }
});
