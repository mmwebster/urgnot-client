import Ember from 'ember';

export default Ember.Component.extend({
  // bindings
  classNames: ['node'],
  classNameBindings: ['type', 'id', 'index', 'layer1:layer-1', 'layer2:layer-2', 'blurParent:parent-blur', 'isRoot:is-root', 'allowContentTransition', 'scaleDown'],
  attributeBindings: ['wrapperStyle:style'],     
  // properties
  layer1: false,
  layer2: false,
  blurParent: false,
  allowContentTransition: false,

  // on component instantiation, prior to DOM insertion
  init: function() {
    this._super();
    // set current node if is root
    if (this.get('isRoot')) {
      window.projectExplorer = {};
      window.projectExplorer.currentNode = this;
    }
    // set children and siblings arrays local this component instance
    this.set('children', []);
    this.set('siblings', []);
  },

  // on DOM insertion, prepares the node tree. Method run only once, and on the tree root.
  treeReady: function() {
    Ember.debug('Tree is ready.');
    // if tree root is not current node

    // Autofocus currently dissabled

    // var rootIsCurrent = this.get('nodeModel.isCurrent');
    // var hasChildren = this.get('nodeModel.children').length > 0;
    // if ((!rootIsCurrent || rootIsCurrent === 'undefined') && hasChildren) {
    //   // recursively find current node
    //   this.discoverCurrentNode(this.get('children'));
    //   // focus in to node
    //   var _this = this;
    //   Ember.run.later(function() {
    //     _this.get('discoveredCurrentNode').autofocus(_this.toString(), [], _this.get('discoveredCurrentNode'), _this.get('discoveredCurrentNode'));
    //   }, 500);
    // }
  },

  discoverCurrentNode: function(nodes) {
    nodes.some(function(node) {
      var children = node.get('children'); 
      if (node.get('nodeModel.isCurrent')) {
        // check if this node isCurrent
        this.set('discoveredCurrentNode', node);
        return true;
        // return true;
      } else if (children.length > 0) {
        // if node has children, recursively check if they are current or their children
        this.discoverCurrentNode(children);
      }
    }, this);
  },

  // sumarize content for layer2 nodes
  name: function() {
    if (this.get('layer2')) {
      return this.get('nodeModel.name').split(" ")[0];
    } else {
      return this.get('nodeModel.name');
    }
  }.property('layer2'),

  id: function() {
    return "id-" + this.get('nodeModel.id');
  }.property(),

  index: function() {
    return "index-" + this.get('nodeIndex');
  }.property(),

  type: function() {
    return "type-" + this.get('nodeModel.displayData');
  }.property(),

  // rotation computation
  wrapperStyle: function() {
    var parent = this.get('parentModel');
    var output = "";
    // if is not root and node is at layer 2
    if (parent) {
      // debugger;
      // degree increments for each sibling
      var rotationIncrements = (360 / parent.get('children.length'));
      var rotation = rotationIncrements * this.get('nodeIndex');
      if (!this.get('layer1') && !this.get('layer2')) {
        rotation = -360;
      }
      // save out for use in content rotation correction
      this.set('rotation', rotation);
      // return styling
      output = "transform: rotate(" + rotation + "deg) !important;";
      output += "-webkit-transform: rotate(" + rotation + "deg) !important;";
    }  
    // confirm string is safe, non integer operations will always result in NaN
    return new Ember.Handlebars.SafeString(output);
  }.property('layer2', 'parentModel'),

  willInsertElement: function() {
    // populate node's parent's children
    var parent = this.get('parentComponent');
    if (parent) {
      parent.get('children').push(this);
    }
    // set top level w/o animation
    if (this.get('nodeModel.displayData') === 'star') {
        this.set('layer1', true);
        this.set('scaleDown', true);
    }
  },

  didInsertElement: function() {
    // populate node's siblings, removing this
    var _this = this;
    var parent = this.get('parentComponent');
    if (parent) {
      parent.get('children').forEach(function(node) {
        if (_this.toString() !== node.toString()) {
          _this.get('siblings').pushObject(node);
        }
      });
    }
    // upon full hiearchy insertion (page load) animate in layers 
    switch(this.get('nodeModel.displayData')) {
      case 'planet':
        Ember.run.next(function() {
          _this.set('layer2', true);
        });
        break;
      case 'star':
        Ember.run.next(function() {
          _this.set('scaleDown', false);
          _this.treeReady();
        });
        break;
    }
    console.log("Inserted component (" + this.get('nodeModel.displayData') + ").");
  },

 // target is defined, now checking recursion to see why current node is not

  /* 
   * @param rootNodeString: toString() conversion of root level node
   * @param treeNodePath: empty array to be recursively filled with node in reverse focus order
   * @param currentNode: the current node in the context of the autofocus() function
   * @param targetNode: the node with isCurrent state that is to be focused to
   */
  autofocus: function(rootNodeString, treeNodePath, currentNode, targetNode) {
    if (rootNodeString !== currentNode.get('parentComponent').toString()) {
      treeNodePath.push(currentNode);
      this.autofocus(rootNodeString, treeNodePath, currentNode.get('parentComponent'), targetNode);
    } else {
      currentNode.focus(targetNode, treeNodePath, treeNodePath.length);
    }
  },

  focus: function(autofocusTargetNode, treeNodeFocusPath, treeNodeFocusPathLength) {
    // perform focus on this node
    Ember.debug('Focusing (' + this.get('nodeModel.displayData') + ') - (' + this.get('nodeModel.name') + ')');

    // reset current node - for use in project explorer interfacing
    window.projectExplorer.currentNode = this;

    // promote this node
    this.set('layer2', false);
    this.set('layer1', true);
    // focus child nodes
    this.get('children').forEach(function(node) {
      node.set('layer2', true);
    });
    // blur parent node
    this.set('parentComponent.layer1', false);
    this.set('parentComponent.blurParent', true);
    // blur siblings
    this.get('siblings').forEach(function(node) {
       node.set('layer2', false); 
    });

    // if autofocusing, continue down path if target not reached
    if (autofocusTargetNode) {
      if (this.toString() !== autofocusTargetNode.toString()) {
        Ember.run.later(function() {
          var nodeFocusChild = treeNodeFocusPath[treeNodeFocusPath.length - 1];
          treeNodeFocusPath.splice(treeNodeFocusPath.indexOf(nodeFocusChild), 1);
          nodeFocusChild.focus(autofocusTargetNode, treeNodeFocusPath, treeNodeFocusPathLength);
        }, 1);
      }
    }
  },

  actions: {
    click: function() {
      this.focus(false);
    },
    createChildNode: function(parent) {
      var name = this.get('newChildName');
      var type = this.get('newChildType');
      var level = parent.get('level') + 1;
      var organizationId = parent.get('organizationId');
      var _this = this;
      var newChildNode = parent.store.createRecord('node', {
        name: name,
        displayData: type,
        parent: parent,
        level: level,
        isRoot: false,
        organizationId: organizationId
      });
      // save record
      parent.get('children').addObject(newChildNode);
      parent.save().then(function() {
        newChildNode.save().then(function() {
          _this.set('newChildName', null);
          _this.set('newChildType', null);
        });
      });
    },
    createTask: function(node) {
      var name = this.get('newTaskName');
      var actionType = this.get('newTaskActionType');
      var actionData = this.get('newTaskActionData');
      var _this = this;
      var newTask = node.store.createRecord('task', {
        name: name,
        actionType: actionType,
        actionData: actionData,
        node: node
      });
      node.get('tasks').addObject(newTask);
      node.save().then(function() {
        newTask.save().then(function() {
          _this.set('newTaskName', null);
          _this.set('newTaskActionType', null);
          _this.set('newTaskActionData', null);
        });
      });
    }
  }
});
