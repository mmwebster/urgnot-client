import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['document-explorer'],
  currentDocument: {new: true, saved: false, saving: false}, //object-> name:string, content:string, createdAt:string
  documentsSorting: ['createdAt:desc'],
  sortedDocuments: Ember.computed.sort('documents', 'documentsSorting'),
  documents: Ember.computed(function() {
    return this.get('store').find('document', {
      orderBy: 'author',
      equalTo: this.get('user.uid')
    });
  }),

  triggerAction: Ember.observer('actionData.trigger', function() {
    if (this.get('actionData.trigger')) {
      // handle incoming action
      Ember.debug('triggering action' + this.get('actionData.type'));
      Ember.debug('..with data ' + this.get('actionData.data'));
      this.set('actionData.trigger', false);
    }
  }),

  actions: {
    openDocument: function(doc) {
      if (this.get('currentDocument.id') !== doc.get('id')) {
        Ember.debug("Setting new document '" + doc.get('name') + "'");
        doc.set('isActive', true);
        doc.set('opening', true);
        this.set('currentDocument.isActive', false);
        this.set('currentDocument', doc);
      } else {
        Ember.debug('Document already selected');
      }
    },
    openBlankDocument: function() {
      this.set('currentDocument.isActive', false);
      this.set('currentDocument', {new: true, saved: false, saving: false});
    }
  }
});
