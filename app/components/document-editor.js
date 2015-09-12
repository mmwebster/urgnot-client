import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['current-document'],
  tagName: 'form',

  nameIsEmpty: Ember.computed.empty('doc.name'),
  nameIsEmpty: Ember.computed.empty('doc.content'),

  formIsEmpty: Ember.computed('nameIsEmpty', 'contentIsEmpty', function() {
    if (this.get('nameIsEmpty') || this.get('contentIsEmpty')) {
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

  actions: {
    save: function() {
      var doc = this.get('doc');
      if (doc.new) {
        // create record
        var _this = this;
        this.get('user.data').then(function(user) {
          // create record
          var newDoc = _this.get('store').createRecord('document', {
            name: doc.name,
            content: doc.content,
            author: user
          });
          // save with inverse
          user.get('documents').addObject(newDoc);
          user.save().then(function() {
            _this.set('doc', newDoc);
            _this.set('doc.saved', true);
            _this.toggleProperty('doc.saving');
            return newDoc.save();
          });
        });
      } else {
        // save record
        this.set('doc.saved', true);
        this.toggleProperty('doc.saving', true);
        doc.save();
      }
    }
  }
});
