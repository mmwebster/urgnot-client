import Ember from 'ember';

export default Ember.Controller.extend({
  transitionLength: null,

  back: function(autoback) {
    var currentNode = window.projectExplorer.currentNode;
    
    // blur project explorer if not at root
    if (!currentNode.get('isRoot')) {

      // set transition length form element style if not null
      if (this.get('transitionLength') === null) {
        var transitionStyle = Ember.$('.project-explorer').css('transition-duration');
        var transitionInMilliseconds = parseFloat(transitionStyle.split("s")[0]) * 1000; // convert seconds->miliseconds
        this.set('transitionLength', transitionInMilliseconds);
      }
      // temporarily add full array of transition to current node
      currentNode.set('allowContentTransition', true);
      Ember.run.later(function() {
        currentNode.set('allowContentTransition', false);
      }, this.get('transitionLength'));

      Ember.debug('Blurring (' + currentNode.get('nodeModel.type') + ') - (' + currentNode.get('nodeModel.name') + ')');

      // demote this node
      currentNode.set('layer2', true);
      currentNode.set('layer1', false);
      // blur child nodes
      currentNode.get('children').forEach(function(node) {
        node.set('layer2', false);
      });
      // focus parent node
      currentNode.set('parentComponent.layer1', true);
      currentNode.set('parentComponent.blurParent', false);
      // focus siblings
      currentNode.get('siblings').forEach(function(node) {
         node.set('layer2', true); 
      });

      // reset current node - for use in project explorer interfacing
      window.projectExplorer.currentNode = currentNode.get('parentComponent');

      // continue back if autoback is true
      if (autoback) {
        var _this = this;
        Ember.run.next(function() {
          _this.back(true);
        });
      }
    } else {
      console.warn('Cannot go back. At top of hierarchy.');
    }
  },

  actions: {
    home: function() {
      this.back(true);
    },
    current: function() {

    },
    back: function() {
      this.back(false);
    }
  },
});
