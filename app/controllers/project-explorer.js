import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    back: function() {
      var currentNode = Window.projectExplorer.currentNode;
      if (!currentNode.get('isRoot')) {
        Em.debug('Blurring (' + currentNode.get('nodeModel.type') + ') - (' 
              + currentNode.get('nodeModel.name') + ')');

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
        Window.projectExplorer.currentNode = currentNode.get('parentComponent');
      } else {
        console.warn('Cannot go back. At top of hierarchy.');
      }
    },
  },
});
