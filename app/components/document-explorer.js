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

  triggerAction: Ember.observer('action.trigger', function() {
    if (this.get('action.trigger')) {
      var data = this.get('action.data');
      // handle incoming actions
      switch(this.get('action.type')) {
        case "edit-document":
          var existingDoc = this.get('sortedDocuments').findBy("identifier", data.identifier);
          if (existingDoc) {
            // document already created
            existingDoc.set('saved', true);
            this._action_openDocument(existingDoc);
          } else {
            // document not created
            var newDoc = {
              new: true, 
              saved: false, 
              saving: false,
              name: data.defaultName,
              content: data.defaultContent,
              identifier: data.identifier,
              placeholder: data.placeholder,
            };
            this._action_openBlankDocument(newDoc);
          }
          
          break;
      }
      this.set('action.trigger', false); // clear flag, action was handled
    }
  }),

  _action_openBlankDocument: function(doc) {
    this.set('currentDocument.isActive', false);
    if (doc) {
      this.set('currentDocument', doc);
    } else {
      this.set('currentDocument', {new: true, saved: false, saving: false});
    }
  },

  _action_openDocument: function(doc) {
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

  actions: {
    openDocument: function(doc) {
      this._action_openDocument(doc);
    },
    // open blank document, optionally with predesignated content
    openBlankDocument: function(doc) {
      this._action_openBlankDocument(doc);
    }
  }
});
