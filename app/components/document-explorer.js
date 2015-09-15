import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['document-explorer'],
  currentDocument: {new: true, saved: false, saving: false}, //object-> name:string, content:string, createdAt:string
  documentsSorting: ['createdAt:desc'],
  sortedDocuments: Ember.computed.sort('documents', 'documentsSorting'),
  documents: Ember.computed(function() {
    var projectId = this.get('user.activeProjectId');
    return this.get('store').find('document', {
      orderBy: 'projectId',
      equalTo: projectId
    });
  }),

  commLinkActive: Ember.observer('commLink.active', function() {
    if (this.get('commLink.active')) {
      Ember.debug('Comm Link Active - in document-explorer component');
        var data = this.get('commLink.data');
        // handle incoming actions
        switch(this.get('commLink.type')) {
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
                projectId: this.get('user.activeProjectId')
              };
              this._action_openBlankDocument(newDoc);
            }
            break;
        }
        this.set('commLink.active', false); // clear flag, action was handled
    } else {
      Ember.debug('Comm Link Inactive');
    }
  }),

  _action_openBlankDocument: function(doc) {
    this.set('currentDocument.isActive', false);
    if (doc) {
      this.set('currentDocument', doc);
    } else {
      this.set('currentDocument', {new: true, saved: false, saving: false, projectId: this.get('user.activeProjectId')});
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
