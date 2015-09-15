import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['current-document'],
  tagName: 'form',

  nameIsEmpty: Ember.computed.empty('doc.name'),
  contentIsEmpty: Ember.computed.empty('doc.content'),

  focus: function(field) {
    var target;
    if (field === "name") {
      target = ".name input";
    } else if (field === "content") {
      target = ".content textarea";
    }
    Ember.$(this.get('element')).find(target).focus();
  },

  formIsEmpty: Ember.computed('nameIsEmpty', 'contentIsEmpty', function() {
    if (this.get('nameIsEmpty') || this.get('contentIsEmpty')) {
      return true;
    } else {
      return false;
    }
  }),

  docChanged: function() {
    Ember.debug('doc changed');
    // determine autofocus
    if (this.get('doc.new')) {
      this.focus("name");
    } else {
      this.focus("content");
    }
  }.observes('doc'),

  deleteAble: Ember.computed('doc', function() {
    if (!this.get('doc.new')) {
      // focus in on title
      return true;
    } else {
      return false;
    }
  }),
       
  // Returns true/false if the doc can be saved. Based on empty doc and if already saved
  saveAble: Ember.computed('doc.name', 'doc.content', 'doc.saving', function() {
    if (!this.get('doc.opening')) {
      if (this.get('doc.saved')) {
        this.set('doc.saved', false);
        return false;
      } else {
        if (!this.get('formIsEmpty')) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      this.set('doc.opening', false);
      return false;
    }
  }),

  autosavePrepared: false,
  prepareAutosave: function() {
    if (this.get('isLive')) {
      if (this.get('saveAble')) {
        if (!this.get('autosavePrepared')) {
          this.set('autosaveUnhandled', true);
          Ember.debug('Preparing autosave.');
        }
        this.set('autosavePrepared', true);
      }
    }
  }.observes("saveAble"),

  autosave: function() {
    if (this.get('autosaveUnhandled')) {
      var _this = this;
      Ember.run.later(function() {
        // _this.set('doc.saved', true);
        // _this.toggleProperty('doc.saving', true);
        _this.get('doc').save();
        _this.set('autosavePrepared', false);
        Ember.debug('Autosaved document.');
      }, 50);
      this.set('autosaveUnhandled', false);
    }
  }.observes('autosavePrepared'),

  actions: {
    save: function() {
      var doc = this.get('doc');
      if (doc.new) {
        // create record
        var _this = this;
        var user = this.get('user');
        var project = this.get('project');
        // create record
        var newDoc = _this.get('store').createRecord('document', {
          name: doc.name || "Untitled",
          content: doc.content,
          author: user,
          createdAt: new Date(),
          identifier: doc.identifier || null,
          projectId: project.get('id')
        });
        // save with inverse
        user.get('documents').addObject(newDoc);
        user.save().then(function() {
          newDoc.set('isActive', true);
          _this.set('doc', newDoc);
          _this.set('doc.saved', true);
          _this.toggleProperty('doc.saving');
          return newDoc.save();
        });
      } else {
        // save record
        this.set('doc.saved', true);
        this.toggleProperty('doc.saving', true);
        doc.save();
      }
    },

    delete: function() {
      var doc = this.get('doc');
      var destroy = confirm("Are you sure you want to permanently delete \"" + doc.get('name') + "\"?");
      if (destroy) {
        this.get('doc').destroyRecord();
        this.attrs.openBlankDocument();
      }
    },

    toggleLive: function() {
      if (!this.get('isLive')) {
        // turning on
        var goLive = confirm("The \"Live\" feature is still under development and you may encounter problems, are you sure you would like to continue?");
        if (goLive) {
          this.set('isLive', true);
        }
      } else {
        //turning off
        this.set('isLive', false);
      }
    }
  }
});
