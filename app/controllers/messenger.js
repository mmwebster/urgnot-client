import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  updates: -1,
  autoScrollPrepared: false,
  threadFocused: false,
  isMinimized: false,

  newThreadName: "",
  currentThread: "",

  errorIsDisplayed: false,
  error: null,

  uid: function() {
    return this.get('controllers.application.currentUser.uid');
  }.property(),

  threads: Ember.computed(function() {
    return this.store.find('thread'); 
  }),
  threadsSorting: ['date:desc'],
  sortedThreads: Ember.computed.sort('threads', 'threadsSorting'),


  messages: Ember.computed('threadFocused', 'thread.messages.length', function() {
    // auto scroll and other func.s that required to be in messages
    if (this.get('threadFocused')) {
      Ember.debug('In messages');
      var scrollheight = Ember.$(".messenger .messages .messages-body")[0].scrollHeight;
      Ember.$(".messenger .messages .messages-body").animate({ scrollTop: scrollheight}, 600);
    }
    var threadId = this.get('thread.id');
    return this.store.find('message', {
      orderBy: 'thread',
      equalTo: threadId
    });
  }),

  // prepares a scroll to be made, uses a 300ms buffer to prevent scroll spaming
  autoScrollBuffer: function() {
    this.set('autoScrollPrepared', true);
  }.observes('thread.messages.@each.body'),

  autoScroll: function() {
    var _this = this;
    Ember.run.later(function() {
      // autoscroll new messages
      Ember.debug('making scroll');
      var scrollheight = Ember.$(".messenger .messages .messages-body")[0].scrollHeight;
      Ember.$(".messenger .messages .messages-body").animate({ scrollTop: scrollheight}, 600);
      // clear prep buffer;
      _this.set('autoScrollPrepared', false);
    }, 300);
  }.observes('autoScrollPrepared'),

  displayError: function(error) {
    this.set('errorIsDisplayed', true);
    this.set('error', error);
    var _this = this;
    Ember.run.later(function() {
      _this.set('errorIsDisplayed', false);
      _this.set('error', null);
    }, 3500);
  },

  focusThread: function(thread) {
    this.set('threadFocused', true);
    this.set('thread', thread);
    this.set('displayThreadTitle', true);
    this.set('currentThread', thread);
    // focus new message field
    Ember.run.later(function() {
      Ember.$(".newMessage input.name").focus();
    }, 300);
  },

  actions: {
    createThread: function() {
      if(this.get('newThreadName') !== "") {
        var _this = this;
        var date = Date.now();
        var newThread = this.store.createRecord('thread', {
          name: this.get('newThreadName'),
          date: date,
          authorUid: this.get('uid')
        });
        this.store.find('user', this.get('uid')).then(function(user) {
          newThread.get('endUser').addObject(user);
          var saved = user.save().then(function() {
            return newThread.save();
          });
          saved.then(function(thread) {
            _this.focusThread(thread);
          });
        });
        this.set('newThreadName', "");
      } else {
        this.displayError("Subject cannot be empty");
      }
    },
    createMessage: function() {
      var body = this.get('newMessageBody');
      if(body !== "") {
        // retrieve message, then nullify
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
          
        });
      } else {
        this.displayError("Message cannot be empty");
      }
    },
    focusThread: function(thread) {
      this.focusThread(thread);
    },
    blurThread: function() {
      this.set('threadFocused', false);
      this.set('displayThreadTitle', false);
    },
    minimize: function() {
      this.toggleProperty('isMinimized');
    }
  }
});
