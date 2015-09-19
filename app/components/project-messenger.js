import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['messenger'],
  classNameBindings: ['isMinimized:is-minimized', 'hamburgerActive.advanced:advanced'],
  isMinimized: true,
  updates: -1,
  autoScrollPrepared: false,
  threadFocused: false,
  hamburgerOptions: false,
  hamburgerActive: {}, // contains all active hamburger toggles

  newThreadName: "",
  currentThread: "",

  errorIsDisplayed: false,
  error: null,

  threads: Ember.computed('user.data', function() {
    if(this.get('user.typeIsAdmin')) {
      // USER ADMIN
      var organizationId = this.get('user.activeOrganizationId');
      Ember.debug('project id is "' + organizationId + '"');
      return this.get('store').find('thread', {
        orderBy: 'organizationId',
        equalTo: organizationId
      });
    } else {
      // USER STUDENT
      var projectId = this.get('user.activeProjectId');
      Ember.debug('project id is "' + projectId + '"');
      return this.get('store').find('thread', {
        orderBy: 'projectId',
        equalTo: projectId
      });
    }
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
    return this.get('store').find('message', {
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
    if (!this.get('hamburgerOptions')) {
      this.set('threadFocused', true);
      this.set('thread', thread);
      this.set('displayThreadTitle', true);
      this.set('currentThread', thread);
      // focus new message field
      Ember.run.later(function() {
        Ember.$(".newMessage input.name").focus();
      }, 300);
    } else {
      this.set('hamburgerOptions', false);
    }
  },

  actions: {
    createThread: function() {
      if(this.get('newThreadName') !== "") {
        var _this = this;
        var date = Date.now();
        var newThread = this.get('store').createRecord('thread', {
          name: this.get('newThreadName'),
          date: date,
          author: this.get('user'),
          authorUid: this.get('user.id'),
          projectId: this.get('user.activeProjectId'),
          organizationId: this.get('user.activeOrganizationId')
        });
        this.get('store').find('user', this.get('user.id')).then(function(user) {
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
        var author = this.get('user');

        // send along the message to thread
        var date = Date.now();
        var newMessage = this.get('store').createRecord('message', {
          author: author,
          date: date,
          body: body
        });

        var thread = this.get('currentThread');
        newMessage.set('thread', thread);
        thread.save().then(function() {
          return newMessage.save();
        });

        Ember.debug('INSERTED: author: ' + author + ', date: ' + date + ', body: ' + body);
          
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
    },
    hamburger: function() {
      this.toggleProperty('hamburgerOptions');
    },
    hamburgerAction: function(action) {
      switch(action) {
        case "advanced":
          this.toggleProperty("hamburgerActive.advanced");
          break;
        case "contacts":
          this.toggleProperty("hamburgerActive.contacts");
      }
      // close the menu
      this.set('hamburgerOptions', false);
    }
  }
});
